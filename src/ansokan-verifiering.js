// document loaded
window.addEventListener("load", () => {
  const id = window.location.href.split("?id=")[1];
  const statusText = document.getElementById("status-text");

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    "https://api.ngine.se/webhook-test/verifikation?id=" + id,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      if (JSON.parse(result).status === "ok") {
        statusText.innerHTML =
          "Verifieringen gick bra och ni ska nu ha fått ett nytt mail från oss!";
      } else if (JSON.parse(result).status === "No id found") {
        statusText.innerHTML =
          "Vi kunde inte hitta er verifiering hos oss, den kanske redan gjorts eller så har det gått för lång tid.";
      }
    })
    .catch((error) => {
      console.log("error", error);
      statusText.innerHTML = "Något gick fel med verifieringen!";
    });
});
