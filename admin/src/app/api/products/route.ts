import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import DatabaseService from '../../../lib/database';

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

// GET - Get all products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const productsCollection = await DatabaseService.getCollection('products');

    // Build query - Admin should see all products regardless of active status
    const query: Record<string, unknown> = { is_active: { $ne: false } }; // deactivated products stay hidden

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, unknown>).$gte = parseFloat(minPrice);
      if (maxPrice) (query.price as Record<string, unknown>).$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      query.stock_quantity = { $gt: 0 };
    } else if (inStock === 'false') {
      query.stock_quantity = { $lte: 0 };
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get products with pagination
    const products = await productsCollection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalProducts = await productsCollection.countDocuments(query);

    // Get categories from admin-managed categories collection
    const categoriesCollection = await DatabaseService.getCollection('product_categories');
    const categoriesData = await categoriesCollection.find({ is_active: true }).toArray();
    const categories = categoriesData.map(cat => cat.name);

    // Format products for response with resolved media URLs
    const formattedProducts = await Promise.all(
      products.map(async product => {
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
        
        return {
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
          updated_at: product.updated_at
        };
      })
    );

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      categories: categories,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit)
      },
      filters: {
        category,
        search,
        minPrice,
        maxPrice,
        inStock,
        sortBy,
        sortOrder
      }
    });

  } catch(error) {
    console.error('Products GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while fetching products'
    }, { status: 500 });
  }
}

// Product create/update/delete live in /api/admin/products (admin-only).
