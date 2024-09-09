const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const { query } = require('../database');

module.exports.createCart = async function (productId, quantity, memberId) {
    try {
        if(parseInt(quantity) <= 0){
            throw new Error("Quantity cannot be 0");
        }

        const productExists = await prisma.product.findUnique({
            where: {
                id: parseInt(productId)
            }
        })

        if (!productExists) {
            throw new Error(`Product ${productId} does not exist`);
        }

        let cart = await prisma.cart.findUnique({
            where: {
                memberId: parseInt(memberId)
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    memberId: parseInt(memberId)
                }
            });
        }

        const existingProduct = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: parseInt(productId)
            }
        });

        if (existingProduct) {
            await prisma.cartItem.update({
                where: {
                    id: existingProduct.id
                },
                data: {
                    quantity: existingProduct.quantity + parseInt(quantity)
                }
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId:parseInt(productId),
                    quantity: parseInt(quantity)
                }
            });
        }
    } catch (error) {
        console.error("Failed to create or update cart:", error);
        throw error; // Re-throw the error to be handled by the controller
    }
}

// To get all cart items
module.exports.getAllCartItems = async function (memberId) {
    try {
        const cartItems = await prisma.cartItem.findMany({
            where: {
                cart: {
                    memberId: parseInt(memberId)
                }
            },
            include: {
                product: true  // Including product details
            }
        });
        
        // Map and calculate the subtotal using 'unitPrice' from the included product
        return cartItems.map(item => ({
            description: item.product.description,
            country: item.product.country,
            unitPrice: item.product.unitPrice,  
            quantity: item.quantity,
            subTotal: item.quantity * item.product.unitPrice, 
            cartItemId: item.id
        }));
    } catch (error) {
        console.error("Error fetching cart items:", error);
        throw error;
    }
}

// To update a cart item quantity
module.exports.updateCartItem = async function (productId, quantity, memberId, cartItemId) {
    try {
        if(parseInt(quantity) <= 0){
            throw new Error("Quantity cannot be 0");
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: parseInt(cartItemId),
                cart: {
                    memberId: parseInt(memberId)
                }
            },
            include: {
                cart: true
            }
        })

        if(!cartItem){
            throw new Error("Cart item not found");
        }

        const updatedCartItem = await prisma.cartItem.update({
            where: {
                id: parseInt(cartItemId)
            },
            data: {
                quantity: parseInt(quantity)
            }
        });

        return updatedCartItem;
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        throw error;
    }
}

// To update cart item quantity in bulk
module.exports.updateMultipleCartItems = async function (cartItems, memberId) {
    try {
        for (const item of cartItems) {
            if (parseInt(item.quantity) <= 0) {
                throw new Error(`Quantity cannot be 0`);
            }

            const cartItem = await prisma.cartItem.findFirst({
                where: {
                    id: parseInt(item.cartItemId),
                    cart: {
                        memberId: memberId  // Ensure it belongs to the correct member
                    }
                },
                include: {
                    cart: true
                }
            });

            if (!cartItem) {
                throw new Error(`Cart item ${item.cartItemId} not found for member ${memberId}`);
            }

            await prisma.cartItem.update({
                where: {
                    id: parseInt(item.cartItemId)
                },
                data: {
                    quantity: parseInt(item.quantity)
                }
            });
        }
    } catch (error) {
        console.error("Error updating multiple cart items:", error);
        throw error;
    }
};

// To delete a cart item
module.exports.deleteSingleCartItem = async function (productId, memberId, cartItemId) {
    try {
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: parseInt(cartItemId),
                cart: {
                    memberId: parseInt(memberId)
                }
            }
        });

        if(!cartItem){
            throw new Error("Cart item not found");
        }

        await prisma.cartItem.delete({
            where: {
                id: parseInt(cartItemId)
            }
        });

    } catch (error) {
        console.error("Error deleting cart item:", error);
        throw error;
    }
}

// To delete cart items in bulk
module.exports.deleteMultipleCartItems = async function (cartItems, memberId) {
    try {
        for (const item of cartItems) {
            const cartItem = await prisma.cartItem.findFirst({
                where: {
                    id: parseInt(item.cartItemId),
                    cart: {
                        memberId: memberId
                    }
                }
            });

            if (!cartItem) {
                throw new Error(`Cart item ${item.cartItemId} not found for member ${memberId}`);
            }

            await prisma.cartItem.delete({
                where: {
                    id: parseInt(item.cartItemId)
                }
            });
        }
    } catch (error) {
        console.error("Error deleting multiple cart items:", error);
        throw error;
    }
}

// To get cart summary
module.exports.getCartSummary = async function (memberId) {
    try {
        // Fetch all cart items for the member along with their product details
        const cartItems = await prisma.cartItem.findMany({
            where: {
                cart: {
                    memberId: parseInt(memberId)
                }
            },
            include: {
                product: true
            }
        });

        // Calculate total quantity and total amount
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.product.unitPrice), 0);

        // Count the total number of unique products
        const uniqueProductCount = new Set(cartItems.map(item => item.product.id)).size;

        const cartSummary = {
            totalQuantity,
            totalAmount,
            totalUniqueProducts: uniqueProductCount
        };

        return cartSummary;
    } catch (error) {
        console.error("Error fetching cart summary:", error);
        throw error;
    }
};

// Cart Checkout
module.exports.checkout = async function (memberId) {
    const sql = 'CALL place_orders($1)';
    
    try {
        const notice = await query(sql, [memberId]);
        console.log(notice.message);
        
        return ({success: true, message: 'Checkout successful!', notices: notice.message});
    } catch (error) {
        console.error('Checkout error:', error);

        // Handle specific error messages based on what the stored procedure might cause
        if (error.message.includes('Out of stock')) {
            throw new Error('One or more items are out of stock.');
        } else {
            throw new Error('An error occurred during checkout. Please try again.');
        }
    }
};