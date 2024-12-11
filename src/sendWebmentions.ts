import axios from 'axios'

async function fetchWebmentions() {
  try {
    const response = await axios.get('https://webmention.io/api/mentions?token=imcNszc0uo-iMwmAz2Fqiw',
      {
        headers: {
          'Content-Type': 'Access-Control-Allow-Origin',
        },
      }
    );
    console.log('Webmentions opgehaald:', response.data);
    displayWebmentions(response.data.links);
    return response.data; // Return the data for further use
  } catch (error: any) {
    console.error('Fout bij het ophalen van Webmentions:', error.response?.data || error.message);
    throw error; // Re-throw error if needed
  }
}

// Display Webmentions on the page
function displayWebmentions(webmentions: any) {
  const container = document.getElementById('webmentions-list');
  const countElement = document.getElementById('webmentions-count');

  // Clear previous content
  if (container) {
    container.innerHTML = '';
  }

  // Display the count of Webmentions
  if (countElement) {
    countElement.innerText = `You have ${webmentions.length ?? 0} Webmentions`;
  }

  // Create a list of Webmentions
  if (webmentions.length > 0) {
    webmentions.forEach((mention: any) => {
      const item = document.createElement('li');
      item.innerHTML = `<strong>Source:</strong> <a href="${mention.source}">${mention.source}</a> <br>
                      <strong>Target:</strong> <a href="${mention.target}">${mention.target}</a>`;
      container?.appendChild(item);
    });
  }
}

// Functie om een Webmention te versturen
async function sendWebmention(source: string, target: string) {
    try {
        const response = await axios.post('http://localhost:3000/webmention', 
            new URLSearchParams({ source, target }), // Formatteer als URL-encoded
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        if (response.status === 202) {
            console.log('Webmention verzonden:', response.data);
        } else {
            console.log('Webmention mislukt:', response.status, response.data);
        }
    } catch (error: any) {
        console.error('Fout bij het verzenden van Webmention:', error.response?.data || error.message);
    }
}

const sendWebmentionIo = async (sourceUrl: string, targetUrl: string) => {
    try {
      const response = await axios.post(
        'https://webmention.io/webmention-client.vercel.app/webmention/5HwCzggz4gECKWR_SzCi', 
        {
          source: sourceUrl,
          target: targetUrl,
        }, 
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      console.log('Webmention response:', response.data);
    } catch (error) {
      console.error('Error sending Webmention:', error);
    }
};

// Event listener voor de button
document.getElementById('send-webmention')?.addEventListener('click', () => {
  const targetUrl = 'http://localhost:3000/blogpost1'; // Het doel dat de bron linkt

  const sourceUrl = window.location.href;

  // Stuur de Webmention
  sendWebmention(sourceUrl, targetUrl);
  sendWebmentionIo("https://webmention-client.vercel.app/", "https://webmention-client.vercel.app/");
});

fetchWebmentions();
