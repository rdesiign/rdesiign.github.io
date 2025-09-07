#!/usr/bin/env python3
"""
Image Optimization Script for Portfolio Website
This script helps optimize images for better web performance
"""

import os
import sys
from pathlib import Path

def analyze_images():
    """Analyze current images and provide optimization recommendations"""
    
    print("🔍 Image Analysis and Optimization Recommendations")
    print("=" * 60)
    
    # Check current directory
    current_dir = Path(".")
    mmm_dir = current_dir / "mmm"
    
    # Analyze main directory images
    main_images = list(current_dir.glob("*.png")) + list(current_dir.glob("*.jpg")) + list(current_dir.glob("*.gif"))
    
    print("\n📁 Main Directory Images:")
    total_size = 0
    for img in main_images:
        size_mb = img.stat().st_size / (1024 * 1024)
        total_size += size_mb
        print(f"  {img.name}: {size_mb:.1f}MB")
        
        # Recommendations
        if size_mb > 2:
            print(f"    ⚠️  OPTIMIZE: Consider reducing to 1-2MB")
        if size_mb > 5:
            print(f"    🚨 CRITICAL: File too large for web! Reduce to <2MB")
    
    # Analyze MMM directory
    if mmm_dir.exists():
        print(f"\n📁 MMM Directory Images:")
        mmm_images = list(mmm_dir.glob("*.png"))
        mmm_total = 0
        
        for img in mmm_images:
            size_mb = img.stat().st_size / (1024 * 1024)
            mmm_total += size_mb
            print(f"  {img.name}: {size_mb:.1f}MB")
            
            if size_mb > 2:
                print(f"    ⚠️  OPTIMIZE: Reduce to 1-2MB for web")
            if size_mb > 5:
                print(f"    🚨 CRITICAL: File too large! Reduce to <2MB")
        
        total_size += mmm_total
    
    print(f"\n📊 Total Image Size: {total_size:.1f}MB")
    
    if total_size > 50:
        print("🚨 CRITICAL: Total image size too large for good web performance!")
    elif total_size > 25:
        print("⚠️  WARNING: Consider optimizing images for better performance")
    else:
        print("✅ Image sizes are reasonable for web use")
    
    print("\n🛠️  OPTIMIZATION RECOMMENDATIONS:")
    print("1. Use online tools like TinyPNG, Squoosh, or ImageOptim")
    print("2. Target file sizes:")
    print("   - Hero images: 500KB - 1MB")
    print("   - Gallery images: 200KB - 800KB")
    print("   - Profile photos: 100KB - 300KB")
    print("3. Optimal resolutions:")
    print("   - Desktop gallery: 1920px wide max")
    print("   - Mobile gallery: 800px wide max")
    print("   - Hero images: 2400px wide max")
    print("4. Use WebP format when possible (85% smaller than PNG)")
    print("5. Enable compression: 80-90% quality for photos")

def generate_optimization_commands():
    """Generate command-line optimization suggestions"""
    
    print("\n🔧 OPTIMIZATION COMMANDS (if you have ImageMagick installed):")
    print("-" * 60)
    
    # Commands for main directory
    print("\n# Optimize main directory images:")
    print("convert 'Exploded Trial.142.png' -quality 85 -resize 2400x2400> 'Exploded_Trial_optimized.jpg'")
    print("convert 'Profile raw 4.jpg' -quality 85 -resize 800x800> 'Profile_optimized.jpg'")
    
    # Commands for MMM directory
    print("\n# Optimize MMM directory images:")
    for i in range(1, 11):
        print(f"convert 'mmm/MMM {i}.png' -quality 85 -resize 1920x1920> 'mmm/MMM_{i}_optimized.jpg'")
    
    print("\n# Convert to WebP (modern browsers, smaller files):")
    print("# First install webp: brew install webp (macOS) or apt install webp (Ubuntu)")
    for i in range(1, 11):
        print(f"cwebp -q 85 'mmm/MMM {i}.png' -o 'mmm/MMM_{i}.webp'")

def create_optimization_html():
    """Create HTML with optimized image loading"""
    
    html_content = """
<!-- Optimized image loading example -->
<picture>
    <source srcset="mmm/MMM_1.webp" type="image/webp">
    <source srcset="mmm/MMM_1_optimized.jpg" type="image/jpeg">
    <img src="mmm/MMM 1.png" alt="Fallback" loading="lazy" decoding="async">
</picture>
"""
    
    print("\n📝 HTML OPTIMIZATION EXAMPLE:")
    print("-" * 40)
    print(html_content)
    print("This provides:")
    print("✅ WebP for modern browsers (85% smaller)")
    print("✅ Optimized JPEG fallback")
    print("✅ Original PNG as final fallback")
    print("✅ Lazy loading for performance")

if __name__ == "__main__":
    analyze_images()
    generate_optimization_commands()
    create_optimization_html()
    
    print("\n" + "=" * 60)
    print("🎯 NEXT STEPS:")
    print("1. Run image optimization tools on your large files")
    print("2. Test optimized images on your website")
    print("3. Replace original files with optimized versions")
    print("4. Monitor loading performance with browser dev tools")
    print("=" * 60)