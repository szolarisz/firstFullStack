console.log("Beléptem");
document.getElementById('fetch-colors').onclick=fetchAndRenderColors;

async function fetchAndRenderColors() {
    const response = await fetch('/colors.json');
    const colors = await response.json();

    let colorsHTML = "<h1>Színek</h1>";
    for( 0 of colors ) {
        colorsHTML += `<div class ='card mb-2 w-50'>
                    <div class='card-body' style='background-color:${color.name}'>
                    <h5 class='card-title'>${color.name}</h5>
                    <p class='card-text'>${color.code}</p>
                    </div>
                    </div>`;
    }

    document.getElementById("color-list-components").innerHTML = colorsHTML;
}

document.getElementbyId('create-color').onsubmit = async function(event) {
    /*
    A kiírás része:
    */
   event.preventDefault();
   const code = event.target.elements.code.value;
   const name = event.target.elements.name.value;
   console.log(`Az új szín neve: ${name} (${code})`);
   
    if( res.ok ){
        fetchAndRenderColors();
    } else {
        console.log("Hiba történt");
        alert("A szerver a kérést nem tudta feldolgozni");
    }
}