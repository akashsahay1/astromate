import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import DatabaseService from '../../../../lib/database';

// Helper function to resolve media ID to full URL
async function resolveMediaUrl(request: NextRequest, mediaId: string | ObjectId | null | undefined): Promise<string | null> {
  if (!mediaId) return null;
  
  try {
    const mediaCollection = await DatabaseService.getCollection('media');
    let mediaFile;
    
    // Check if it's our custom media ID format (media_timestamp_random)
    if (typeof mediaId === 'string' && mediaId.startsWith('media_')) {
      mediaFile = await mediaCollection.findOne({ media_id: mediaId });
    } else if (typeof mediaId === 'string' && mediaId.length === 24) {
      // Try as ObjectId for backward compatibility
      try {
        mediaFile = await mediaCollection.findOne({ _id: new ObjectId(mediaId) });
        // If not found by _id, try by media_id
        if (!mediaFile) {
          mediaFile = await mediaCollection.findOne({ media_id: mediaId });
        }
      } catch {
        // If ObjectId conversion fails, try as media_id
        mediaFile = await mediaCollection.findOne({ media_id: mediaId });
      }
    } else if (mediaId instanceof ObjectId) {
      mediaFile = await mediaCollection.findOne({ _id: mediaId });
    }
    
    if (!mediaFile || !mediaFile.file_path) return null;
    
    // Get the actual host from the request headers
    const host = request.headers.get('host') || 'api.astromate.online';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;
    
    return `${baseUrl}${mediaFile.file_path}`;
  } catch (error) {
    console.error('Error resolving media URL:', error);
    return null;
  }
}

// GET - Get single product details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID',
        message: 'Valid product ID is required'
      }, { status: 400 });
    }

    const productsCollection = await DatabaseService.getCollection('products');
    const reviewsCollection = await DatabaseService.getCollection('product_reviews');

    // Get product - support both custom product_id and MongoDB ObjectId
    let product;
    if (productId.startsWith('product_')) {
      // Custom product_id format (e.g., "product_1756540783734_wxtlznqe")
      product = await productsCollection.findOne({
        product_id: productId,
        is_active: true
      });
    } else if (ObjectId.isValid(productId)) {
      // MongoDB ObjectId format
      product = await productsCollection.findOne({
        _id: new ObjectId(productId),
        is_active: true
      });
    } else {
      // Try as custom product_id anyway
      product = await productsCollection.findOne({
        product_id: productId,
        is_active: true
      });
    }

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found',
        message: 'Product not found or inactive'
      }, { status: 404 });
    }

    // Get reviews for this product (use the product's custom product_id)
    const reviews = await reviewsCollection
      .find({ product_id: product.product_id })
      .sort({ created_at: -1 })
      .limit(10)
      .toArray();

    // Get related products from same category (exclude current product by its _id)
    const relatedProducts = await productsCollection
      .find({
        category: product.category,
        _id: { $ne: product._id },
        is_active: true
      })
      .limit(6)
      .toArray();

    // Resolve featured image from image_id (media_id)
    let imageUrl = null;
    if (product.image_id) {
      imageUrl = await resolveMediaUrl(request, product.image_id);
    }
    
    // Resolve gallery images from images array (array of media_ids)
    const resolvedImages = [];
    if (product.images && Array.isArray(product.images)) {
      for (const mediaId of product.images) {
        const url = await resolveMediaUrl(request, mediaId);
        if (url) resolvedImages.push(url);
      }
    }

    // Resolve related products images
    const resolvedRelatedProducts = await Promise.all(
      relatedProducts.map(async related => {
        let relatedImageUrl = null;
        if (related.image_id) {
          relatedImageUrl = await resolveMediaUrl(request, related.image_id);
        }
        
        return {
          _id: related._id.toString(),
          product_id: related.product_id, // Include custom product_id
          name: related.name,
          price: related.price,
          original_price: related.original_price,
          discount_percentage: related.discount_percentage,
          featured_image: relatedImageUrl,
          rating: related.rating || 0,
          review_count: related.review_count || 0
        };
      })
    );

    // Format product for response
    const formattedProduct = {
      _id: product._id.toString(),
      product_id: product.product_id, // Include custom product_id
      name: product.name,
      description: product.description,
      name_hi: product.name_hi,
      description_hi: product.description_hi,
      price: product.price,
      original_price: product.original_price,
      discount_percentage: product.discount_percentage,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      featured_image: imageUrl, // Resolved featured image URL
      gallery_images: resolvedImages, // Resolved gallery image URLs
      images: resolvedImages, // Keep backward compatibility
      stock_quantity: product.stock_quantity,
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      tags: product.tags || [],
      rating: product.rating || 0,
      review_count: product.review_count || 0,
      is_featured: product.is_featured || false,
      is_bestseller: product.is_bestseller || false,
      created_at: product.created_at,
      updated_at: product.updated_at,
      reviews: reviews.map(review => ({
        _id: review._id.toString(),
        user_name: review.user_name,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        created_at: review.created_at
      })),
      related_products: resolvedRelatedProducts
    };

    return NextResponse.json({
      success: true,
      product: formattedProduct
    });

  } catch(error) {
    console.error('Product details GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while fetching product details'
    }, { status: 500 });
  }
}

// Product create/update/delete live in /api/admin/products (admin-only).
