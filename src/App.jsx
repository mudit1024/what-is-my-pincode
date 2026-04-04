import { useState } from "react";
// import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

function App() {
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [city, setCity] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [country, setCountry] = useState(null);
  const [fullAddress, setFullAddress] = useState(null);
  const [error, setError] = useState(null);

  const fetchLocation = () => {

    setLoading(true); // start loading
    setError(null); // reset previous error

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setLatitude(lat);
          setLongitude(lon);
          // 🔥 API CALL STARTS HERE
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );

          const data = await response.json();
          const address = data.address;

          setPincode(address?.postcode || "Not found");

          const cityValue =
            address?.city ||
            address?.town ||
            address?.village ||
            address?.hamlet;
          setCity(cityValue || "Unknown");
          setStateName(address?.state || "Unknown");
          setCountry(address?.country || "Unknown");
          setFullAddress(data.display_name || "Not available");
          const pin = address?.postcode;

          if (!pin)
            setError("Pincode not found for this location");

        } catch (err) {
          setError("Something went wrong while fetching data");
        }
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        if (error.code === 1) {
          setError("Permission denied. Please allow location access.");
        } else if (error.code === 2) {
          setError("Location unavailable.");
        } else {
          setError("Failed to get location.");
        }
      }
      ,
      {
        enableHighAccuracy: true,
        maximumAge: 0
        // 30000 // allow cache for 30 sec
        ,
        timeout: 10000
      }
    );
  };

  const copyPincode = () => {
    if (pincode) {
      navigator.clipboard.writeText(pincode);
      alert("Pincode copied!");
    }
  };

  const shareLocation = () => {
    if (navigator.share && pincode) {
      navigator.share({
        title: "My Pincode",
        text: `My current pincode is ${pincode}`,
      });
    } else {
      alert("Sharing not supported on this browser");
    }
  };

  // useEffect(() => {
  //   fetchLocation();
  // }, []);

  return (
    <>
      <Helmet>
        <title>What is my Pincode? | Free Tool</title>
        <meta
          name="description"
          content="Get your current location instantly with one click. Free tool to find Pincode, latitude and longitude."
        />

        <meta
          name="keywords"
          content="my location, find my location, latitude longitude, pincode, what is my pincode"
        />
      </Helmet>
      <div className="app">
        <div className="card">
          <h1>What is my Pincode?</h1>

          <button onClick={fetchLocation} disabled={loading}>
            {loading ? "Fetching..." : "Get My Pincode"}
          </button>

          {/* {loading && <p>Fetching your location... ⏳</p>} */}
          {loading && <div className="loader"></div>}

          {error && <p className="error">{error}</p>}

          {pincode && (
            <div className="pincode-box">
              <h2>{pincode}</h2>

              <div className="actions">
                <button onClick={copyPincode}>Copy</button>
                <button onClick={shareLocation}>Share</button>
              </div>
            </div>
          )}

          {city && (
            <div className="details">
              <p>{city}, {stateName}</p>
              <p>{country}</p>
            </div>
          )}

          {fullAddress && (
            <p className="coords">{fullAddress}</p>
          )}
          {latitude && longitude && (
            <p className="coords">
              {latitude}, {longitude}
            </p>
          )}
        </div>
      </div>
    </>

  );
}

export default App;