const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '../../');

function resolvePath(relativePath) {
  return path.join(projectRoot, relativePath);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const platforms = ['facebook', 'instagram', 'tiktok', 'linkedin', 'google-ads'];

module.exports = {
  projectRoot,
  resolvePath,
  ensureDir,
  platforms,
  screenshots: () => resolvePath('pipeline/screenshots'),
  screenshotsByPlatform: (platform) => {
    const dir = resolvePath(`pipeline/screenshots/${platform}`);
    return dir;
  },
  allScreenshotPlatforms: () => {
    const screenshotsDir = resolvePath('pipeline/screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      return [];
    }
    return fs.readdirSync(screenshotsDir)
      .filter(item => fs.statSync(path.join(screenshotsDir, item)).isDirectory())
      .sort();
  },
  reports: () => {
    const dir = resolvePath('pipeline/reports');
    ensureDir(dir);
    return dir;
  },
  reportsByPlatform: (platform) => {
    const dir = resolvePath(`pipeline/reports/${platform}`);
    ensureDir(dir);
    return dir;
  },
  ideas: () => {
    const dir = resolvePath('pipeline/ideas');
    ensureDir(dir);
    return dir;
  },
  content: () => resolvePath('content'),
  contentVideos: () => resolvePath('content/videos'),
  contentImages: () => resolvePath('content/images'),
  contentPosts: () => resolvePath('content/posts'),
  contentDesigns: () => resolvePath('content/designs')
};
