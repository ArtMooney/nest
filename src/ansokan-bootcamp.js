// handle cookies
var readCookie = (function () {
  return {
    getCookie: function (name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length === 2) {
        return parts.pop().split(";").shift();
      }
    },
  };
})();

var createCookie = function (name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
};

function deleteCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function listCookies() {
  var theCookies = document.cookie.split(";");
  var aString = "";
  for (var i = 1; i <= theCookies.length; i++) {
    aString += i + " " + theCookies[i - 1] + "\n";
  }
  return aString;
}

// get hubspot data
(function getHubspotData() {
  var formId = document.getElementById("ansokan");

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

  if (readCookie.getCookie("hubspotutk") !== undefined) {
    formId.hubspotutk.value = readCookie.getCookie("hubspotutk");
  } else {
    formId.hubspotutk.value = "";
  }
})();

// repopulate-form
(function repopulateForm() {
  window.onload = function () {
    if (readCookie.getCookie("nest-form2") !== undefined) {
      var formCookie = JSON.parse(readCookie.getCookie("nest-form2"));

      var allInputs = document
        .getElementById("ansokan")
        .getElementsByTagName("input");
      var allTextareas = document
        .getElementById("ansokan")
        .getElementsByTagName("textarea");
      var allSelectors = document
        .getElementById("ansokan")
        .getElementsByTagName("select");

      // Get all relevant inputs
      for (var i = 0; i < allInputs.length; i++) {
        if (formCookie[allInputs[i].name] !== undefined) {
          if (allInputs[i].type === "checkbox") {
            allInputs[i].checked = formCookie[allInputs[i].name];
            if (allInputs[i].checked === true) {
              allInputs[i].click();
              if (allInputs[i].checked !== true) allInputs[i].checked = true;
            }
          } else {
            allInputs[i].value = formCookie[allInputs[i].name];
          }
        }
      }

      // Add dynamic member textareas
      var numberOfDynamicElements = 0;
      for (var key in formCookie) {
        for (var memberNumber = 2; memberNumber < 10; memberNumber++) {
          if (key === "member" + memberNumber) {
            numberOfDynamicElements++;
          }
        }
      }

      for (i = 0; i < numberOfDynamicElements; i++) {
        document.getElementById("add-team-member").click();
      }

      // Get all relevant textareas
      for (i = 0; i < allTextareas.length; i++) {
        if (formCookie[allTextareas[i].name] !== undefined) {
          allTextareas[i].value = formCookie[allTextareas[i].name];
        }
      }

      // Get all relevant selectors
      for (i = 0; i < allSelectors.length; i++) {
        if (formCookie[allSelectors[i].name] !== undefined) {
          allSelectors[i].value = formCookie[allSelectors[i].name];
        }
      }
    }
  };
})();

// scroll to anchor
function anchorScroll(input) {
  input.select();
  window.scrollTo(0, input.offsetTop);
}

// make inits
var allInputs = document
  .getElementById("ansokan")
  .getElementsByTagName("input");
var allTextareas = document
  .getElementById("ansokan")
  .getElementsByTagName("textarea");
var allSelectors = document
  .getElementById("ansokan")
  .getElementsByTagName("select");
var formSave = {};

// form collector
var saveInterval = setInterval(() => {
  // Get all relevant inputs
  for (var i = 0; i < allInputs.length; i++) {
    if (
      allInputs[i].value !== "Skicka" &&
      allInputs[i].name !== "filename" &&
      allInputs[i].name !== "gdpr-confirm" &&
      allInputs[i].name !== "clientip" &&
      allInputs[i].name !== "hubspotutk" &&
      allInputs[i].name !== "pageuri" &&
      allInputs[i].name !== "pagename"
    ) {
      if (allInputs[i].type === "checkbox") {
        formSave[allInputs[i].name] = allInputs[i].checked;
      } else {
        formSave[allInputs[i].name] = allInputs[i].value;
      }
    }
  }

  // Get all relevant textareas
  for (i = 0; i < allTextareas.length; i++) {
    formSave[allTextareas[i].name] = allTextareas[i].value;
  }

  // Get all relevant selectors
  for (i = 0; i < allSelectors.length; i++) {
    formSave[allSelectors[i].name] = allSelectors[i].value;
  }

  if (readCookie.getCookie("nest-form2") === undefined) {
    createCookie("nest-form2", JSON.stringify(formSave), 180);
  } else {
    deleteCookie("nest-form2");
    createCookie("nest-form2", JSON.stringify(formSave), 180);
  }
}, 3000);

// add-member
document
  .getElementById("add-team-member")
  .addEventListener("click", function () {
    var member = document.getElementById("member");
    var memberData = document
      .getElementById("member")
      .getElementsByTagName("textarea")[0];

    var moreMembers = document.getElementById("more-members");
    moreMembers.insertAdjacentHTML("beforeend", member.innerHTML);
    var moreMembersText = moreMembers.getElementsByTagName("textarea");

    moreMembersText[moreMembersText.length - 1].name =
      memberData.name + (moreMembersText.length + 1);

    moreMembersText[moreMembersText.length - 1].removeAttribute("id");
    moreMembersText[moreMembersText.length - 1].removeAttribute("required");
  });

// character-counter
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
        event.target.parentElement.getElementsByClassName("input")[0].maxLength;
      var currentLength =
        event.target.parentElement.getElementsByClassName("input")[0].value
          .length;
      event.target.parentElement.getElementsByClassName(
        "counter"
      )[0].innerHTML = maxLength - currentLength;
    });
  }
}

// send form
document.getElementById("send-form").addEventListener("click", function () {
  document.getElementById("send-warning").style.display = "none";
  var formdata = new FormData();

  // Get all relevant inputs
  for (var i = 0; i < allInputs.length; i++) {
    if (
      allInputs[i].value !== "Skicka" &&
      allInputs[i].name !== "filename" &&
      allInputs[i].name !== "gdpr-confirm"
    ) {
      if (allInputs[i].type === "checkbox") {
        formdata.append(allInputs[i].name, allInputs[i].checked);
      } else {
        formdata.append(allInputs[i].name, allInputs[i].value);
      }
    }
  }

  // Get all relevant textareas
  for (i = 0; i < allTextareas.length; i++) {
    formdata.append(allTextareas[i].name, allTextareas[i].value);
  }

  // Get all relevant selectors
  for (i = 0; i < allSelectors.length; i++) {
    formdata.append(allSelectors[i].name, allSelectors[i].value);
  }

  // Get all relevant files
  for (i = 0; i < allInputs.length; i++) {
    if (allInputs[i].type === "file") {
      if (allInputs[i].files[0]) {
        formdata.append(
          "file",
          allInputs[i].files[0],
          allInputs[i].files[0].name
        );
      }
    }
  }

  if (document.getElementById("gdpr-confirm").checked === true) {
    document.getElementById("gdpr-warning").style.display = "none";

    // checklist;
    var formDone = true;
    for (i = 0; i < allInputs.length; i++) {
      if (allInputs[i].required) {
        if (allInputs[i].value === "") {
          formDone = false;
          anchorScroll(document.getElementById(allInputs[i].id));
          i = allInputs.length;
        }
      }
    }

    if (formDone) {
      for (i = 0; i < allTextareas.length; i++) {
        if (allTextareas[i].required) {
          if (allTextareas[i].value === "") {
            formDone = false;
            anchorScroll(document.getElementById(allTextareas[i].id));
            i = allTextareas.length;
          }
        }
      }
    }

    if (formDone) {
      for (i = 0; i < allSelectors.length; i++) {
        if (allSelectors[i].required) {
          if (
            allSelectors[i].value === "" ||
            allSelectors[i].value === "Vet ej"
          ) {
            formDone = false;
            window.scrollTo(
              0,
              document.getElementById(allSelectors[i].id).offsetTop
            );
            i = allSelectors.length;
          }
        }
      }
    }

    if (formDone) {
      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      fetch("https://ngine.app.n8n.cloud/webhook/ansokan", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          document.getElementById("send-form").innerHTML = "Vänta...";

          setTimeout(() => {
            clearInterval(saveInterval);
            deleteCookie("nest-form2");
            document.getElementById("thank-you").click();
          }, 1000);
        })
        .catch((error) => {
          console.log("error", error);
          document.getElementById("send-warning").style.display = "flex";
        });
    }
  } else {
    document.getElementById("gdpr-warning").style.display = "flex";
  }
});
