function showHideUnconnectedButtonInitial() {
    showHideUnconnectedButton = document.getElementById("showHideUnconnectedButton");
    if (displayUnconnected == false) {
        showHideUnconnectedButton.value = 'Display Unconnected'
    } else {
        showHideUnconnectedButton.value = 'Hide Unconnected';
    };
};

function showHideUnconnectedButtonOnClick(button) {
    if (button.value == 'Hide Unconnected') {
        button.value = 'Display Unconnected'
    } else {
        button.value = 'Hide Unconnected';
    };
    showHideUnconnected();
};

function layerSelectorOnClick(target) {
    showHideDeviceRoles(target.value, target.checked);
}

// Function to add eventlistener to dropdown buttons
// This is to properly use stopPropagation so the dropdown does not close onclick
(function () {
    var layer_inputs = document.getElementsByClassName("layer_input");
    function stopPropagation(event) {
        event.stopPropagation();
    }
    for (var i = 0; i < layer_inputs.length; i++) {
        layer_inputs[i].addEventListener('click', stopPropagation, false);
    }
})();


function showHidePassiveDevicesButtonInitial() {
    showHidePassiveDevicesButton = document.getElementById("showHidePassiveDevicesButton");
    if (displayPassiveDevices == false) {
        showHidePassiveDevicesButton.value = 'Display Passive Devices'
    } else {
        showHidePassiveDevicesButton.value = 'Hide Passive Devices';
    };
};

function showHidePassiveDevicesButtonOnClick(button) {
    if (button.value == 'Hide Passive Devices') {
        button.value = 'Display Passive Devices'
        displayLogicalMultiCableLinks = true;
        showHideLogicalMultiCableLinks();
    } else {
        button.value = 'Hide Passive Devices';
        showHideLogicalMultiCableLinks();
    };
    showHidePassiveDevices();
};
