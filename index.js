let token = '';
const currentDate = new Date();
// Basicamente lo que estoy haciendo aqui es comparar si n es menor que 10, pues quiero que se ponga un string con el valor de '0' y despues la fetcha para poder utilizarla en el fetch.
function fetcha(n) {
  return n < 10 ? '0' + n : n;
}
const currentDayOfMonth = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const dateString =
  fetcha(currentYear) +
  '-' +
  fetcha(currentMonth + 1) +
  '-' +
  fetcha(currentDayOfMonth);

async function getToken() {
  try {
    // Creo el body que me pide el API para poder obtener el TOKEN
    let urlencoded = new URLSearchParams();
    // Le inserto los llaves y los valores necesarios (ID/CONTRASEÑA)
    urlencoded.append('grant_type', 'client_credentials');
    urlencoded.append('client_id', 'hYLR3WpGU429bkcKQ5T3lqME3GYndZfM');
    urlencoded.append('client_secret', 'DPvtKCKysW3MfvWi');
    // Una nueva variable donde asigno el body necesario con el tipo de request
    let requestOptionsForToken = {
      method: 'POST',
      body: urlencoded,
    };
    //
    const response = await fetch(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      requestOptionsForToken
    );
    const result = await response.json();
    token = await result.access_token;
  } catch (error) {
    console.error(error);
  }
}
// Llamo a la funcion getToken para que cada vez que se recarga la pagina se lanza para que tenga el token y poder hacer el fetch

getToken();

const getFlight = async () => {
  // Obteniendo los valores de origin para ponerlos en el fetch
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  // con el token que obtenido arriba lo paso en el header para que me de acceso a la base de datos y hacer el fetch
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  // es una condicion simple para ver la longitud de los campos si se cumple pues se hace el fetch y si no pues le pongo un mensaje en vez de hacer el fetch y mostrar el error del Back-End
  if (origin.length < 3 || destination.length < 3) {
    //
    let get = (document.getElementById('res').innerHTML =
      'Por favor rellene los formularios ');
  } else {
    const response = await fetch(
      `https://test.api.amadeus.com/v1/shopping/flight-dates?origin=${origin}&destination=${destination}&departureDate=${dateString}&oneWay=true&nonStop=false`,
      requestOptions
    );
    const result = await response.json();
    console.log(result);
    if (response.status === 200) {
      let get = (document.getElementById(
        'res'
      ).innerHTML = `Tu vieaje de ${result.data[0].origin} a  ${result.data[0].destination} cuesta ${result.data[0].price.total}$`);
      document.getElementById('hidden').style.display = 'inline-block';
    } else if (response.status === 404) {
      let get = (document.getElementById('res').innerHTML =
        result.errors[0].detail);
      document.getElementById('hidden').style.display = 'inline-block';
    } else if (response.status === 500) {
      let get = (document.getElementById('res').innerHTML =
        result.errors[0].detail);
      document.getElementById('hidden').style.display = 'inline-block';
    } else if (response.status === 401) {
      let get = (document.getElementById('res').innerHTML =
        'Por favor recarga la pagina para poder hacer tu busqueda');
    }
  }
};

const buscar = document
  .getElementById('buscar')
  .addEventListener('click', getFlight);

const relode = document
  .getElementById('hidden')
  .addEventListener('click', (_) => {
    window.location.reload();
  });
