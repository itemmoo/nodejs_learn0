        // --- Mock Product Data ---
        const products = [
            { id: 1, name: "Neural Interface Headset", description: "Seamless connection to the digital world.", price: 499.99, image: "https://placehold.co/400x300/4f46e5/ffffff?text=Interface" },
            { id: 2, name: "Portable Fusion Reactor", description: "Unlimited power in your pocket.", price: 1299.00, image: "https://placehold.co/400x300/6366f1/ffffff?text=Fusion+Core" },
            { id: 3, name: "Holo-Projector Watch", description: "Display 3D holograms from your wrist.", price: 249.50, image: "https://placehold.co/400x300/818cf8/ffffff?text=Holo+Watch" },
            { id: 4, name: "Gravity Boots", description: "Walk on ceilings and defy basic physics.", price: 750.00, image: "https://placehold.co/400x300/a5b4fc/ffffff?text=Gravity+Boots" },
            { id: 5, name: "Quantum Data Drive 1TB", description: "Store lightyears of data instantly.", price: 199.99, image: "https://placehold.co/400x300/4f46e5/ffffff?text=Data+Drive" },
            { id: 6, name: "Silent Drone Companion", description: "Follows you everywhere, noiselessly.", price: 899.99, image: "https://placehold.co/400x300/6366f1/ffffff?text=Drone+Buddy" },
            { id: 7, name: "Smart Climate Vest", description: "Regulate your body temperature perfectly.", price: 349.00, image: "https://placehold.co/400x300/818cf8/ffffff?text=Climate+Vest" },
            { id: 8, name: "Bio-Luminescent Lamp", description: "Living light source that never needs batteries.", price: 150.00, image: "https://placehold.co/400x300/a5b4fc/ffffff?text=Bio+Lamp" },
        ];

        // --- Global State ---
        let cart = []; // Array of { productId, name, price, image, quantity }

        // --- DOM Element References ---
        const productGrid = document.getElementById('productGrid');
        const cartCountElement = document.getElementById('cartCount');
        const cartModal = document.getElementById('cartModal');
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartTotalElement = document.getElementById('cartTotal');
        const cartButton = document.getElementById('cartButton');
        const closeCartButton = document.getElementById('closeCartButton');
        const messageBox = document.getElementById('messageBox');
        const messageTitle = document.getElementById('messageTitle');
        const messageBody = document.getElementById('messageBody');
        const messageIcon = document.getElementById('messageIcon');


        // --- Utility Functions ---

        /**
         * Formats a number as a currency string.
         * @param {number} amount
         * @returns {string}
         */
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount);
        }

        // --- Custom Alert/Message Box Implementation ---
        const alertBox = {
            timeoutId: null,

            getIcon: (type, colorClass) => {
                // Returns an SVG for the given type
                if (type === 'success') {
                    return `<svg class="h-6 w-6 ${colorClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
                } else if (type === 'warning') {
                    return `<svg class="h-6 w-6 ${colorClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
                }
                // Default info icon
                return `<svg class="h-6 w-6 ${colorClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            },

            show: (title, body, type = 'info', duration = 3000) => {
                if (alertBox.timeoutId) {
                    clearTimeout(alertBox.timeoutId);
                }

                let bgColorClass = 'bg-blue-50 border-blue-400';
                let textColorClass = 'text-blue-700';
                let iconColorClass = 'text-blue-500';

                if (type === 'success') {
                    bgColorClass = 'bg-success/10 border-success';
                    textColorClass = 'text-success-800';
                    iconColorClass = 'text-success';
                } else if (type === 'warning') {
                    bgColorClass = 'bg-warning/10 border-warning';
                    textColorClass = 'text-warning-800';
                    iconColorClass = 'text-warning';
                }

                messageBox.className = `alert-box fixed bottom-4 right-4 p-4 w-80 rounded-lg shadow-xl border-l-4 ${bgColorClass} transform transition-transform duration-300 ease-out translate-y-0`;
                messageTitle.className = `text-sm font-medium ${textColorClass}`;
                messageBody.className = `mt-1 text-sm ${textColorClass}`;

                messageTitle.textContent = title;
                messageBody.textContent = body;
                messageIcon.innerHTML = alertBox.getIcon(type, iconColorClass);
                messageBox.classList.remove('hidden');

                alertBox.timeoutId = setTimeout(alertBox.hide, duration);
            },

            hide: () => {
                messageBox.classList.add('translate-y-full');
                messageBox.classList.remove('translate-y-0');
                // Hide completely after transition
                setTimeout(() => messageBox.classList.add('hidden'), 300);
            }
        };


        // --- Cart Logic ---

        /**
         * Updates the cart count in the header and the total in the modal.
         */
        function updateCartUI() {
            const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            cartCountElement.textContent = totalCount;
            cartTotalElement.textContent = formatCurrency(totalAmount);

            renderCartItems();
        }

        /**
         * Renders the individual items in the cart modal.
         */
        function renderCartItems() {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-center text-gray-500 py-8">Your cart is empty. Add some amazing gadgets!</p>';
                return;
            }

            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md" 
                         onerror="this.onerror=null; this.src='https://placehold.co/64x64/e5e7eb/4f46e5?text=Item';">
                    <div class="flex-grow">
                        <h4 class="text-base font-semibold text-gray-900">${item.name}</h4>
                        <p class="text-sm text-gray-600">${formatCurrency(item.price)} x ${item.quantity} = ${formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <!-- Decrement button -->
                        <button onclick="changeQuantity(${item.productId}, -1)" class="p-1 text-gray-600 hover:text-primary transition disabled:opacity-50" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                        </button>
                        <span class="font-medium">${item.quantity}</span>
                        <!-- Increment button -->
                        <button onclick="changeQuantity(${item.productId}, 1)" class="p-1 text-gray-600 hover:text-primary transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                    </div>
                    <!-- Remove button -->
                    <button onclick="removeFromCart(${item.productId})" class="text-red-500 hover:text-red-700 transition ml-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            `).join('');
        }

        /**
         * Adds a product to the cart or increments its quantity.
         * @param {number} productId
         */
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return console.error('Product not found');

            const existingItem = cart.find(item => item.productId === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            alertBox.show("Item Added!", `${product.name} added to cart.`, "success");
            updateCartUI();
        }

        /**
         * Changes the quantity of an item in the cart.
         * @param {number} productId
         * @param {number} change (+1 or -1)
         */
        function changeQuantity(productId, change) {
            const item = cart.find(item => item.productId === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    updateCartUI();
                }
            }
        }

        /**
         * Removes an item completely from the cart.
         * @param {number} productId
         */
        function removeFromCart(productId) {
            const item = cart.find(item => item.productId === productId);
            if (item) {
                alertBox.show("Item Removed", `${item.name} has been removed from your cart.`, "info");
            }
            cart = cart.filter(item => item.productId !== productId);
            updateCartUI();
        }

        /**
         * Simulates checkout.
         */
        function checkout() {
            if (cart.length === 0) {
                alertBox.show("Your cart is empty!", "Please add items before checking out.", "warning");
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alertBox.show("Order Placed!", `Total: ${formatCurrency(total)}. Thank you for shopping!`, "success", 5000);
            
            // Clear the cart
            cart = [];
            updateCartUI();
            closeModal();
        }


        // --- Product Rendering ---

        /**
         * Renders all products onto the main grid.
         */
        function renderProducts() {
            productGrid.innerHTML = products.map(product => `
                <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
                    <!-- Image -->
                    <img src="${product.image}" alt="${product.name}" 
                         class="w-full h-48 object-cover object-center border-b"
                         onerror="this.onerror=null; this.src='https://placehold.co/400x300/e5e7eb/4f46e5?text=No+Image';">
                    
                    <div class="p-5 flex flex-col justify-between h-56">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 mb-2">${product.name}</h3>
                            <p class="text-sm text-gray-500 mb-4">${product.description}</p>
                        </div>
                        
                        <div class="flex justify-between items-center mt-auto">
                            <span class="text-2xl font-extrabold text-primary">${formatCurrency(product.price)}</span>
                            <button onclick="addToCart(${product.id})" 
                                    class="flex items-center space-x-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition duration-150 ease-in-out shadow-md hover:shadow-lg">
                                <!-- Icon: Plus -->
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 3v3m-3-3h6m-9-3h6"></path></svg>
                                <span>Add</span>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // --- Modal Control ---

        function openModal() {
            cartModal.classList.remove('hidden');
            cartModal.classList.add('flex');
            document.body.style.overflow = 'hidden'; // Prevent scrolling the background
        }

        function closeModal() {
            cartModal.classList.add('hidden');
            cartModal.classList.remove('flex');
            document.body.style.overflow = '';
        }

        // --- Event Listeners and Initialization ---

        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            updateCartUI();

            // Set up modal listeners
            cartButton.addEventListener('click', openModal);
            closeCartButton.addEventListener('click', closeModal);

            // Close modal if clicking outside the inner content (the backdrop)
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    closeModal();
                }
            });
        });