// Function to trigger the linking of references
function triggerLinkify() {
    window.dispatchEvent(new Event('esv-crossref.trigger-linkify'));
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all audio elements with the class 'mejs-player'
    let players = document.querySelectorAll('.mejs-player');

    players.forEach(function (player) {
        new MediaElementPlayer(player, {
            // Customize player options to include more controls
            features: [
                'playpause',
                'progress',
                'current',
                'duration',
                'volume',
                'tracks',
                'fullscreen',
                'speed',
                'loop',
            ],
        });
    });

    // Trigger the linkify event after the custom widget has loaded content
    let sermonDetailsElement = document.getElementById('SermonDetails');

    sermonDetailsElement.addEventListener('load', () => {
        triggerLinkify();
    });

    // If the custom widget doesn't trigger a load event, use MutationObserver to detect content changes
    let observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (
                mutation.type === 'childList'
                && mutation.addedNodes.length > 0
            ) {
                triggerLinkify();
            }
        }
    });

    observer.observe(sermonDetailsElement, {
        childList: true,
        subtree: true,
    });
});

triggerLinkify();
