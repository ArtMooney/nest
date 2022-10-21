// variables
const formId = document.getElementById("ansokan-bootcamp");

// functions
setWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage and return null
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

function getHubspotData(formId) {
  var formId = document.getElementById(formId);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("https://api.ipify.org?format=json", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      formId.clientip.value = result.ip;
      formId.pageuri.value = window.location.href;
      formId.pagename.value = document.title;
    })
    .catch((error) => console.log("error", error));
}

function repopulateForm() {
  const formSave = getWithExpiry("nest-bootcamp");

  if (formSave) {
    // Add all inputs
    for (const item of formId.querySelectorAll("input")) {
      for (const input of formSave) {
        if (item.type === "checkbox") {
          if (item.name === Object.keys(input)[0]) {
            if (Object.values(input)[0] === true) item.click();
          }
        } else if (item.type === "radio") {
          if (item.value === Object.keys(input)[0]) {
            if (Object.values(input)[0] === true) item.click();
          }
        } else if (item.type === "file") {
          if (item.name === Object.keys(input)[0]) {
          }
        } else {
          if (item.name === Object.keys(input)[0]) {
            item.value = Object.values(input)[0];
          }
        }
      }
    }

    // Add all textareas
    for (const item of formId.querySelectorAll("textarea")) {
      for (const input of formSave) {
        if (item.name === Object.keys(input)[0]) {
          item.value = Object.values(input)[0];
        }
      }
    }

    // Add all selectors
    for (const item of formId.querySelectorAll("select")) {
      for (const input of formSave) {
        if (item.name === Object.keys(input)[0]) {
          item.value = Object.values(input)[0];
        }
      }
    }
  }
}

// scroll to anchor
function anchorScroll(input) {
  input.select();
  window.scrollTo(0, input.offsetTop);
}

function characterCounter() {
  var allDivs = document.querySelectorAll("div");

  for (var i = 0; i < allDivs.length; i++) {
    if (allDivs[i].getAttribute("counter")) {
      var maxLength = allDivs[i].getElementsByClassName("input")[0].maxLength;
      var currentLength =
        allDivs[i].getElementsByClassName("input")[0].value.length;
      allDivs[i].getElementsByClassName("counter")[0].innerHTML =
        maxLength - currentLength;

      allDivs[i].addEventListener("keyup", function (event) {
        var maxLength =
          event.target.parentElement.getElementsByClassName("input")[0]
            .maxLength;
        var currentLength =
          event.target.parentElement.getElementsByClassName("input")[0].value
            .length;
        event.target.parentElement.getElementsByClassName(
          "counter"
        )[0].innerHTML = maxLength - currentLength;
      });
    }
  }
}

function formCollector() {
  var saveInterval = setInterval(() => {
    let formSave = [];

    // append all inputs except button
    for (const item of formId.querySelectorAll("input")) {
      if (item.type !== "submit") {
        if (item.type === "file") {
          if (item.files[0]) {
            for (const file of item.files) {
              formSave.push({
                [item.name]: {
                  lastModified: file.lastModified,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                },
              });
            }
          }
        } else if (
          item.name !== "gdpr-confirm" &&
          item.name !== "clientip" &&
          item.name !== "hubspotutk" &&
          item.name !== "pageuri" &&
          item.name !== "pagename"
        ) {
          if (item.type === "checkbox") {
            formSave.push({ [item.name]: item.checked });
          } else if (item.type === "radio") {
            formSave.push({ [item.value]: item.checked });
          } else {
            formSave.push({ [item.name]: item.value });
          }
        }
      }
    }

    // append all textareas
    for (const item of formId.querySelectorAll("textarea")) {
      formSave.push({ [item.name]: item.value });
    }

    // Get all relevant selectors
    for (const item of formId.querySelectorAll("select")) {
      formSave.push({ [item.name]: item.value });
    }

    setWithExpiry("nest-bootcamp", formSave, 1000 * 60 * 60 * 24 * 180);
  }, 3000);
}

document.getElementById("send-form").addEventListener("click", (event) => {
  let formdata = new FormData();
  let formComplete = true;

  Webflow.push(function () {
    // disable webflow form submit
    $("form").submit(function () {
      return false;
    });
  });

  // append all inputs except button
  for (const item of formId.querySelectorAll("input")) {
    if (item.type !== "submit") {
      if (item.type === "checkbox") {
        if (item.required === true && item.checked === false)
          formComplete = false;
        formdata.append(item.name, item.checked);
      } else if (item.type === "radio") {
        formdata.append(item.value, item.checked);
      } else if (item.type === "file") {
        if (item.files[0]) {
          formdata.append("file", item.files[0], item.files[0].name);
        }
      } else {
        if (item.required === true && item.value === "") formComplete = false;
        formdata.append(item.name, item.value);
      }
    }
  }

  // append all textareas
  for (const item of formId.querySelectorAll("textarea")) {
    if (item.required === true && item.value === "") formComplete = false;
    formdata.append(item.name, item.value);
  }

  // append all selectors
  for (const item of formId.querySelectorAll("select")) {
    if (item.required === true && item.value === "") formComplete = false;
    formdata.append(item.name, item.value);
  }

  if (formComplete) {
    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api.ngine.se/webhook-test/ansokan-bootcamp", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // selector.disabled = true;
        document.getElementById("send-form").value = "Vänta...";

        setTimeout(() => {
          // setWithExpiry("nest-bootcamp", "", 0);
          document.getElementById("thank-you").click(); // redirect
          // document.getElementById("success-message").style.display = "block";
        }, 1000);
      })
      .catch((error) => {
        console.log("error", error);
        document.getElementById("error-message").style.display = "block";
        formId.addEventListener(
          "click",
          (event) => {
            document.getElementById("error-message").style.display = "none";
          },
          { once: true }
        );
      });
  }
});

// document loaded
window.addEventListener("load", () => {
  getHubspotData("ansokan-bootcamp");
  repopulateForm();
  characterCounter();
  formCollector();
});
