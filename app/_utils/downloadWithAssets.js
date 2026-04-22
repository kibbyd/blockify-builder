import JSZip from 'jszip';
import FileSaver from 'file-saver';

/**
 * Extract all media assets from the elements tree
 * @param {Array} elements - The elements array
 * @returns {Array} Array of media assets with their data
 */
const extractMediaAssets = (elements) => {
  const assets = [];
  const processedSrcs = new Set();

  const processElement = (element) => {
    // Debug logging
    if (element.props && element.props.src) {
      console.log('Processing element:', element.type, {
        hasSrc: !!element.props.src,
        isDataUrl: element.props.src?.startsWith('data:'),
        hasUploadedFileName: !!element.props.uploadedFileName,
        uploadedFileName: element.props.uploadedFileName,
        srcPreview: element.props.src?.substring(0, 50)
      });
    }

    // Check if element has uploaded media or icon
    if (element.props) {
      const { src, uploadedFileName } = element.props;

      // Process data URLs (uploaded files) OR icon paths from library
      const isDataUrl = src && src.startsWith('data:');
      const isIconPath = element.type === 'icon' && src && src.startsWith('/icons/');

      if (src && uploadedFileName && !processedSrcs.has(src) && (isDataUrl || isIconPath)) {
        console.log('Found asset:', element.type, uploadedFileName, isDataUrl ? 'data URL' : 'icon path');
        processedSrcs.add(src);

        // Determine file type and folder
        let folder = 'assets';
        let fileName = uploadedFileName;

        if (element.type === 'image' || (src.startsWith('data:image/'))) {
          folder = 'assets/images';
        } else if (element.type === 'video' || (src.startsWith('data:video/'))) {
          folder = 'assets/videos';
        } else if (element.type === 'icon' || uploadedFileName.endsWith('.svg')) {
          folder = 'assets/icons';
        }

        assets.push({
          src,
          fileName,
          folder,
          path: `${folder}/${fileName}`,
          elementType: element.type,
          isIconPath: isIconPath  // Mark if it's an icon path for special handling
        });
      }
    }

    // Process children
    if (element.children && element.children.length > 0) {
      element.children.forEach(processElement);
    }

    // Process columns
    if (element.columns && element.columns.length > 0) {
      element.columns.forEach(column => {
        if (Array.isArray(column)) {
          column.forEach(processElement);
        }
      });
    }
  };

  console.log('Processing elements for assets. Total elements:', elements.length);
  elements.forEach(processElement);
  console.log('Total assets found:', assets.length);
  console.log('Assets:', assets.map(a => ({ fileName: a.fileName, type: a.elementType })));
  return assets;
};

/**
 * Convert data URL to blob
 * @param {string} dataUrl - The data URL to convert
 * @returns {Blob} The blob representation
 */
const dataUrlToBlob = (dataUrl) => {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
};

/**
 * Replace data URLs and icon paths in Liquid code with asset paths
 * @param {string} liquidCode - The Liquid code
 * @param {Array} assets - Array of media assets
 * @returns {string} Updated Liquid code with asset paths
 */
const replaceDataUrlsWithPaths = (liquidCode, assets) => {
  let updatedCode = liquidCode;

  assets.forEach(asset => {
    // For Shopify, we'll use the asset_url filter
    const shopifyAssetPath = `{{ '${asset.fileName}' | asset_url }}`;

    if (asset.isIconPath) {
      // For icon paths, replace the public path with asset_url
      // e.g., /icons/icons1/star-o.svg -> {{ 'star-o.svg' | asset_url }}
      const escapedPath = asset.src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      updatedCode = updatedCode.replace(new RegExp(escapedPath, 'g'), shopifyAssetPath);
    } else {
      // For data URLs, replace with asset_url
      // Need to escape the data URL for regex
      const escapedDataUrl = asset.src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      updatedCode = updatedCode.replace(new RegExp(escapedDataUrl, 'g'), shopifyAssetPath);
    }
  });

  return updatedCode;
};

/**
 * Download Liquid file with all media assets packaged together
 * @param {string} liquidCode - The generated Liquid code
 * @param {Array} elements - The elements array
 * @param {string} sectionName - Name of the section
 */
export const downloadWithAssets = async (liquidCode, elements, sectionName = 'custom-section') => {
  try {
    // Extract all media assets
    const assets = extractMediaAssets(elements);

    // Create a new JSZip instance
    const zip = new JSZip();

    // Replace data URLs with asset paths in Liquid code
    const updatedLiquidCode = replaceDataUrlsWithPaths(liquidCode, assets);

    // Add the Liquid file to the zip
    const sectionsFolder = zip.folder('sections');
    sectionsFolder.file(`${sectionName}.liquid`, updatedLiquidCode);

    // Add all media assets to the zip
    const assetsFolder = zip.folder('assets');

    for (const asset of assets) {
      try {
        let blob;

        if (asset.isIconPath) {
          // For icon paths, fetch the SVG file from the public directory
          const response = await fetch(asset.src);
          if (response.ok) {
            blob = await response.blob();
          } else {
            console.error('Failed to fetch icon:', asset.src);
            continue;
          }
        } else {
          // Convert data URL to blob
          blob = dataUrlToBlob(asset.src);
        }

        // Add to appropriate subfolder
        assetsFolder.file(asset.fileName, blob);
      } catch (error) {
        console.error('Error processing asset:', asset.fileName, error);
        // Skip problematic assets silently
      }
    }

    // Add a README file with instructions
    const readme = `Shopify Section Package
======================

This package contains:
1. ${sectionName}.liquid - Your Shopify section file
2. ${assets.length} media asset(s) in the assets folder

Installation Instructions:
--------------------------

1. Upload ${sectionName}.liquid to your theme's /sections folder
2. Upload all files from the /assets folder to your theme's /assets folder
3. The section will automatically reference the uploaded assets

Media Assets Included:
---------------------
${assets.map(a => `- ${a.fileName} (${a.elementType})`).join('\n')}

Note: Make sure all asset files are uploaded to Shopify before activating the section.
`;

    zip.file('README.txt', readme);

    // Generate the zip file
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });

    // Download the zip file
    FileSaver.saveAs(blob, `${sectionName}-package.zip`);

    return {
      success: true,
      assetCount: assets.length,
      message: `Package created with ${assets.length} asset(s)`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
};

/**
 * Download just the Liquid file (for backward compatibility)
 * @param {string} liquidCode - The generated Liquid code
 * @param {string} fileName - Name of the file
 */
export const downloadLiquidFile = (liquidCode, fileName = 'section.liquid') => {
  const blob = new Blob([liquidCode], { type: 'text/plain;charset=utf-8' });
  FileSaver.saveAs(blob, fileName);
};
