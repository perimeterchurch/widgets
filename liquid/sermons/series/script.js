function initializeSermonSeriesFinder() {
    let seriesCards = document.querySelectorAll('.series-card');
    let maxItems = 9;
    let hideClass = 'hide-sermon';
    let currentIndex = maxItems;

    // Hide all cards initially except the first maxItems
    seriesCards.forEach((card, index) => {
        if (index >= maxItems) {
            card.classList.add(hideClass);
        }
    });

    // Function to load more sermons
    function loadMoreSermons() {
        let hiddenCards = document.querySelectorAll('.' + hideClass);

        for (let i = 0; i < maxItems && i < hiddenCards.length; i++) {
            hiddenCards[i].classList.remove(hideClass);
        }

        currentIndex += maxItems;

        if (hiddenCards.length <= maxItems) {
            observer.disconnect(); // Disconnect observer when all items are shown
        } else {
            observer.observe(hiddenCards[maxItems - 1]); // Observe the new last visible card
        }
    }

    // IntersectionObserver to detect when the user has scrolled to the bottom
    let observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                observer.unobserve(entries[0].target);
                loadMoreSermons();
            }
        },
        {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        },
    );

    // Observe the initial last visible card
    let initialLastCard = document.querySelector(
        '.series-card:nth-child(' + maxItems + ')',
    );

    if (initialLastCard) {
        observer.observe(initialLastCard);
    }
}

// Polling function to wait for an element to appear
function waitForElementToDisplay(selector, time) {
    if (document.querySelector(selector) != null) {
        initializeSermonSeriesFinder();
    } else {
        setTimeout(() => {
            waitForElementToDisplay(selector, time);
        }, time);
    }
}

// Start polling for the element
waitForElementToDisplay('.series-card', 200); // Use a selector that matches your dynamic content
