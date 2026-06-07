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

module.exports = {
  projectRoot,
  resolvePath,
  ensureDir,
  screenshots: () => resolvePath('pipeline/screenshots'),
  reports: () => {
    const dir = resolvePath('pipeline/reports');
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
