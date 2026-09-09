const fs = require('fs');
const path = require('path');
const https = require('https');
const cp = require('child_process');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

function cleanHtml(html) {
  // Extract body content if whole document
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  // Remove script tags
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Replace Next.js image proxy URLs with direct local paths
  content = content.replace(/src="\/_next\/image\?url=(%2Flp%2F[^&]+)[^"]*"/g, (match, encodedPath) => {
    return `src="${decodeURIComponent(encodedPath)}"`;
  });

  // Also replace any URL encoded image paths
  content = content.replace(/src="\/_next\/image\?url=([^"&]+)[^"]*"/g, (match, encoded) => {
    try {
      const decoded = decodeURIComponent(encoded);
      return `src="${decoded}"`;
    } catch (e) {
      return match;
    }
  });

  // Remove srcSet / imageSrcSet / sizes
  content = content.replace(/srcSet="[^"]*"/gi, '');
  content = content.replace(/imageSrcSet="[^"]*"/gi, '');
  content = content.replace(/sizes="[^"]*"/gi, '');

  // Point auth / main links properly
  content = content.replace(/href="\/login\?reauth=1"/g, 'href="/login"');
  content = content.replace(/href="https:\/\/naano\.com\//g, 'href="/');
  content = content.replace(/href="https:\/\/naano\.com"/g, 'href="/"');

  return content;
}

async function downloadLpImages(html) {
  const publicDir = path.join(__dirname, '..', 'public');
  const lpDir = path.join(publicDir, 'lp');
  if (!fs.existsSync(lpDir)) fs.mkdirSync(lpDir, { recursive: true });

  const lpMatches = [...new Set([...html.matchAll(/\/lp\/[a-zA-Z0-9_\-\.]+\.(png|jpg|jpeg|svg|webp)/g)].map(m => m[0]))];
  console.log(`Found ${lpMatches.length} /lp/ images`);

  for (const imgPath of lpMatches) {
    const filename = path.basename(imgPath);
    const dest = path.join(lpDir, filename);
    if (!fs.existsSync(dest)) {
      console.log(`Downloading ${filename}...`);
      try {
        await new Promise((resolve) => {
          const file = fs.createWriteStream(dest);
          https.get(`https://naano.com${imgPath}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            res.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          }).on('error', () => resolve());
        });
      } catch (err) {
        console.warn(`Failed to download ${imgPath}:`, err.message);
      }
    }
  }
}

async function downloadCssFromHtml(html, pageName) {
  const cssMatches = [...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)].map(m => m[1]);
  console.log(`Page ${pageName} has ${cssMatches.length} CSS files:`, cssMatches);
  let combined = '';
  for (const cssRel of cssMatches) {
    const fullUrl = `https://naano.com${cssRel}`;
    try {
      const { data: cssContent } = await fetchUrl(fullUrl);
      combined += `\n/* --- ${pageName}: ${cssRel} --- */\n` + cssContent;
    } catch (e) {
      console.warn(`Failed CSS fetch ${fullUrl}:`, e.message);
    }
  }
  return combined;
}

function writeDataTs(filePath, exportName, htmlString) {
  // Safely export as string constant using JSON stringify to avoid quote/escaping issues
  const code = `export const ${exportName} = ${JSON.stringify(htmlString)};\n`;
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Wrote ${filePath} (${(code.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  console.log('--- 1. Restoring Home, Creators, and Agencies from Git ---');
  let homeClean = '';
  let creatorsClean = '';
  let agenciesClean = '';

  try {
    homeClean = cp.execSync('git show 11369de:naano_body_clean.html').toString('utf8');
  } catch (e) {
    console.warn('Fallback fetching home...');
    const { data } = await fetchUrl('https://naano.com/');
    homeClean = cleanHtml(data);
  }

  try {
    creatorsClean = cp.execSync('git show 726d9b7:naano_creators_body_clean.html').toString('utf8');
  } catch (e) {
    console.warn('Fallback fetching creators...');
    const { data } = await fetchUrl('https://naano.com/creators');
    creatorsClean = cleanHtml(data);
  }

  try {
    agenciesClean = cp.execSync('git show f1d305a:naano_agencies_body_clean.html').toString('utf8');
  } catch (e) {
    console.warn('Fallback fetching agencies...');
    const { data } = await fetchUrl('https://naano.com/agencies');
    agenciesClean = cleanHtml(data);
  }

  writeDataTs(path.join(dataDir, 'homeHtml.ts'), 'homeHtml', homeClean);
  writeDataTs(path.join(dataDir, 'creatorsHtml.ts'), 'creatorsHtml', creatorsClean);
  writeDataTs(path.join(dataDir, 'agenciesHtml.ts'), 'agenciesHtml', agenciesClean);

  console.log('--- 2. Fetching Blog Page ---');
  const { data: blogRaw } = await fetchUrl('https://naano.com/blog');
  await downloadLpImages(blogRaw);
  const blogCss = await downloadCssFromHtml(blogRaw, 'blog');
  const blogClean = cleanHtml(blogRaw);
  writeDataTs(path.join(dataDir, 'blogHtml.ts'), 'blogHtml', blogClean);

  console.log('--- 3. Fetching Case Study (blogseo) Page ---');
  const { data: csRaw } = await fetchUrl('https://naano.com/case-studies/blogseo');
  await downloadLpImages(csRaw);
  const csCss = await downloadCssFromHtml(csRaw, 'case-studies-blogseo');
  const csClean = cleanHtml(csRaw);
  writeDataTs(path.join(dataDir, 'caseStudyBlogSeoHtml.ts'), 'caseStudyBlogSeoHtml', csClean);

  console.log('--- 4. Updating Master CSS ---');
  const publicDir = path.join(__dirname, '..', 'public');
  let currentMaster = '';
  if (fs.existsSync(path.join(publicDir, 'naano_master.css'))) {
    currentMaster = fs.readFileSync(path.join(publicDir, 'naano_master.css'), 'utf8');
  }

  const updatedMaster = `${currentMaster}\n/* --- BLOG STYLES --- */\n${blogCss}\n/* --- CASE STUDY STYLES --- */\n${csCss}\n`;
  fs.writeFileSync(path.join(publicDir, 'naano_master.css'), updatedMaster, 'utf8');
  console.log(`Updated naano_master.css (${(updatedMaster.length / 1024).toFixed(1)} KB)`);

  console.log('SUCCESS! All data files and assets generated.');
}

main().catch(err => {
  console.error('Build script error:', err);
  process.exit(1);
});
