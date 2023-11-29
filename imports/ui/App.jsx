import React from "react";
import LoadingSpinner from "./LoadingSpinner";
// ANDROID PERMISSION STATUSES https://www.npmjs.com/package/cordova.plugins.diagnostic#permissionstatus-constants
export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [permissionStatus, setPermissionStatus] = React.useState();

  React.useEffect(() => {
    if (Meteor.isCordova) {
      document.addEventListener("deviceready", onDeviceReady, false);
    }
  }, []);
  function onDeviceReady() {
    console.log("Device is ready");
    checkCameraPermissionState();
  }
  function handleError(error) {
    console.log("An error occurred: " + error);
  }
  function checkCameraPermissionState() {
    if (Meteor.isCordova) {
      cordova.plugins.diagnostic.getCameraAuthorizationStatus(function (
        status
      ) {
        setPermissionStatus(status);
        if (status === "GRANTED") {
          console.log("Permission granted loading IDWise");
          loadIDWise();
        }
      },
      handleError);
    }
  }

  function requestCameraPermissions() {
    if (Meteor.isCordova) {
      cordova.plugins.diagnostic.requestCameraAuthorization({
        successCallback: function (status) {
          switch (status) {
            case "NOT_REQUESTED":
              console.log("Permission not requested");
              break;
            case "DENIED_ALWAYS":
              console.log("Permission denied");
              break;
            case "GRANTED":
            case "LIMITED": // iOS 14+
              console.log("Permission granted", status);
              loadIDWise();
              setPermissionStatus("GRANTED");
              break;
          }
          console.log(
            "Successfully requested camera authorization: authorization was " +
              status
          );
        },
        errorCallback: handleError,
        externalStorage: true,
      });
    }
  }

  function loadIDWise() {
    if (permissionStatus !== "GRANTED") {
      alert("Please allow camera permissions first");
      return;
    }
    try {
      setIsLoading(true);
      IDWise.initialize({
        clientKey:
          "Please add you client key", //replace xxxx with client key that you got from IDWise
        locale: "en ",
      })
        .then(idwise => {
          idwise.startJourney({
            mount: "#idwise-mount",
            journeyDefinitionId: "please add the journey def id here", // replace xxx with your jounrey definition id
            referenceNo: "test", // is optional, pass your reference id if it is needed.
            eventHandlers: {
              onJourneyStarted: function (details) {
                alert("Journey started, journey id =" + details.journeyId);
              },
              onJourneyFinished: function (details) {
                alert("Journey finished, journey id =" + details.journeyId);
              },
              onJourneyCancelled: function (details) {
                alert("Journey cancelled, journey id =" + details.journeyId);
              },
            },
          });
        })
        .catch(error => {
          alert(error);
          setIsLoading(false);
        });
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {isLoading ? <LoadingSpinner /> : null}
      <h3>Meteor-Cordova Example !</h3>
      {Meteor.isCordova ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <p>
            <strong>Camera Permission Status:</strong> {permissionStatus}
          </p>
          <button
            onClick={requestCameraPermissions}
            style={{ height: "30px" }}
            disabled={isLoading}
          >
            Load IDWise 
          </button>
        </div>
      ) : null}
      <div id="idwise-mount"></div>
    </div>
  );
}
