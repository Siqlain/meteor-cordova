import React from 'react';
try {
  IDWise.initialize({
    clientKey:
      "add your client key", //replace xxxx with client key that you got from IDWise
    locale: "en",
  })
    .then(idwise => {
      idwise.startJourney({
        mount: "#idwise-mount",
        journeyDefinitionId: "add journey def id", // replace xxx with your jounrey definition id
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
    });
} catch (error) {
  alert(error);
}
export const App = () => (
  <div id="idwise-mount"  ></div>
  
);
