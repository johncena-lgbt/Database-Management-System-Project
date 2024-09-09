const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();
const prisma = new PrismaClient({});

// To retrieve all sale orders with filters and sorting
module.exports.retrieveAll = async function retrieveAll(filters) {
    console.log(filters);
    
    try {
        const where = {
            AND: [],
        };

        if (filters.status) {
            where.AND.push({ status: { in: filters.status.split(',') } });
        }

        // Filter by order datetime range
        if (filters.minOrderDatetime || filters.maxOrderDatetime) {
            where.AND.push({
                orderDatetime: {
                    ...(filters.minOrderDatetime && { gte: new Date(filters.minOrderDatetime) }),
                    ...(filters.maxOrderDatetime && { lte: new Date(filters.maxOrderDatetime) }),
                },
            });
        }

        // Filter by item quantity range
        if (filters.minQuantity || filters.maxQuantity) {
            where.AND.push({
                saleOrderItem: {
                    some: {
                        quantity: {
                            ...(filters.minQuantity && { gte: parseInt(filters.minQuantity) }),
                            ...(filters.maxQuantity && { lte: parseInt(filters.maxQuantity) }),
                        },
                    },
                },
            });
        }

        // Filter by product description and unit price range
        const productFilters = {};
        if (filters.searchProductDescription) {
            productFilters.description = { contains: filters.searchProductDescription, mode: 'insensitive' };
        }
        if (filters.minUnitPrice) {
            productFilters.unitPrice = { gte: filters.minUnitPrice };
        }
        if (filters.maxUnitPrice) {
            productFilters.unitPrice = { lte: filters.maxUnitPrice };
        }

        if (Object.keys(productFilters).length > 0) {
            where.AND.push({
                saleOrderItem: {
                    some: {
                        product: {
                            AND: [productFilters],
                        },
                    },
                },
            });
        }

        // Filter by member's username and date of birth range
        const memberFilters = {};
        if (filters.username) {
            memberFilters.username = { contains: filters.username, mode: 'insensitive' };
        }
        if (filters.minDob) {
            memberFilters.dob = { gte: new Date(filters.minDob) };
        }
        if (filters.maxDob) {
            memberFilters.dob = { lte: new Date(filters.maxDob) };
        }

        if (Object.keys(memberFilters).length > 0) {
            where.AND.push({
                member: {
                    AND: [memberFilters],
                },
            });
        }

        // Build the orderBy clause
        const orderBy = filters.sortOrder && filters.sortOrder === 'asc' ? { orderDatetime: 'asc' } : { orderDatetime: 'desc' };

        // Execute the Prisma query
        const saleOrderDetails = await prisma.saleOrder.findMany({
            where: where.AND.length > 0 ? where : undefined,
            orderBy,
            include: {
                member: {
                    select: {
                        username: true,
                        dob: true,
                    },
                },
                saleOrderItem: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                description: true,
                                imageUrl: true,
                                unitPrice: true,
                                country: true,
                                productType: true,
                            },
                        },
                    },
                },
            },
        });

        // Additional check to ensure filtering correctness
        const result = saleOrderDetails
        .map((order) =>
            order.saleOrderItem
                .filter(item => 
                    (!filters.searchProductDescription || item.product.description.toLowerCase().includes(filters.searchProductDescription.toLowerCase())) &&
                    (!filters.minQuantity || item.quantity >= parseInt(filters.minQuantity)) &&
                    (!filters.maxQuantity || item.quantity <= parseInt(filters.maxQuantity)) &&
                    (!filters.minUnitPrice || item.product.unitPrice >= parseFloat(filters.minUnitPrice)) &&
                    (!filters.maxUnitPrice || item.product.unitPrice <= parseFloat(filters.maxUnitPrice))
                )
                .map((item) => ({
                    name: item.product.name,
                    description: item.product.description,
                    imageUrl: item.product.imageUrl,
                    unitPrice: item.product.unitPrice,
                    quantity: item.quantity,
                    country: item.product.country,
                    saleOrderId: order.id,
                    orderDatetime: order.orderDatetime,
                    status: order.status,
                    productType: item.product.productType,
                    username: order.member.username,
                }))
        )
        .flat();

        console.log(`Total rows ${result.length}`);
        return result;
    } catch (error) {
        console.error('Error fetching sale order details:', error);
        throw error;
    }
};
