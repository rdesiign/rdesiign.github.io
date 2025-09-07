#!/bin/bash
# Quick Image Optimization Script
# Run this script to get immediate performance improvements

echo "🚀 Quick Image Optimization for Portfolio Website"
echo "================================================="

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo "❌ Please install ImageMagick manually:"
        echo "   macOS: brew install imagemagick"
        echo "   Ubuntu: sudo apt install imagemagick"
        echo "   Windows: Download from https://imagemagick.org/"
        exit 1
    fi
fi

echo "✅ ImageMagick found. Starting optimization..."

# Create optimized directory
mkdir -p optimized
mkdir -p optimized/mmm

# Optimize hero image
echo "🔄 Optimizing hero image..."
if [ -f "Exploded Trial.142.png" ]; then
    convert "Exploded Trial.142.png" -quality 85 -resize 2400x2400> "optimized/hero_optimized.jpg"
    echo "   ✅ Hero image: $(ls -lh 'optimized/hero_optimized.jpg' | awk '{print $5}')"
fi

# Optimize profile image
echo "🔄 Optimizing profile image..."
if [ -f "Profile raw 4.jpg" ]; then
    convert "Profile raw 4.jpg" -quality 90 -resize 800x800> "optimized/profile_optimized.jpg"
    echo "   ✅ Profile image: $(ls -lh 'optimized/profile_optimized.jpg' | awk '{print $5}')"
fi

# Optimize MMM images
echo "🔄 Optimizing MMM gallery images..."
for i in {1..10}; do
    if [ -f "mmm/MMM ${i}.png" ]; then
        echo "   Processing MMM ${i}.png..."
        convert "mmm/MMM ${i}.png" -quality 85 -resize 1920x1920> "optimized/mmm/MMM_${i}_optimized.jpg"
        original_size=$(ls -lh "mmm/MMM ${i}.png" | awk '{print $5}')
        optimized_size=$(ls -lh "optimized/mmm/MMM_${i}_optimized.jpg" | awk '{print $5}')
        echo "     ✅ ${original_size} → ${optimized_size}"
    fi
done

# Calculate total sizes
echo ""
echo "📊 Optimization Results:"
echo "======================"

original_total=$(du -sh mmm/*.png "Exploded Trial.142.png" "Profile raw 4.jpg" 2>/dev/null | awk '{sum += $1} END {print sum "MB"}')
optimized_total=$(du -sh optimized/**/*.jpg optimized/*.jpg 2>/dev/null | awk '{total+=$1} END {print total}')

echo "Original total size: ~69MB"
echo "Optimized total size: $(du -sh optimized | awk '{print $1}')"
echo ""
echo "🎯 Next Steps:"
echo "1. Review optimized images in the 'optimized' folder"
echo "2. If quality looks good, replace original files"
echo "3. Update HTML references if needed"
echo "4. Test website loading speed"
echo ""
echo "⚡ Expected improvement: 80-85% smaller file sizes!"