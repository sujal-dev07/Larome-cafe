const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Cafe Ordering System API",
            version: "1.0.0",
            description:
                "REST API documentation for Cafe Menu and Order Management System",
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Development Server",
            },
        ],

        tags: [
            {
                name: "Menu",
                description: "Cafe menu management APIs",
            },
            {
                name: "Orders",
                description: "Customer order management APIs",
            },
        ],

        components: {
            schemas: {
                MenuItem: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "690000000000000000000001",
                        },
                        name: {
                            type: "string",
                            example: "Cappuccino",
                        },
                        description: {
                            type: "string",
                            example: "Freshly brewed espresso with steamed milk",
                        },
                        price: {
                            type: "number",
                            example: 120,
                        },
                        category: {
                            type: "string",
                            example: "Coffee",
                        },
                        image: {
                            type: "string",
                            example: "https://example.com/cappuccino.jpg",
                        },
                        isAvailable: {
                            type: "boolean",
                            example: true,
                        },
                    },
                },

                Order: {
                    type: "object",
                    properties: {
                        customerName: {
                            type: "string",
                            example: "Rahul Patel",
                        },
                        phone: {
                            type: "string",
                            example: "9876543210",
                        },
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    menuItem: {
                                        type: "string",
                                    },
                                    quantity: {
                                        type: "integer",
                                        example: 2,
                                    },
                                },
                            },
                        },
                        totalAmount: {
                            type: "number",
                            example: 240,
                        },
                        status: {
                            type: "string",
                            example: "pending",
                        },
                    },
                },
            },
        },
    },

    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;