// utils.mjs
export function safeFolderName(name) {
    return name.replace(/[^a-zA-Z0-9-_]/g, '_');
  }
  