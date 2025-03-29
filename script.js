document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentList = document.getElementById('appointment-list');
    const reminderList = document.getElementById('reminder-list');

    appointmentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const doctor = document.getElementById('doctor').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const reason = document.getElementById('reason').value;
        const priority = document.getElementById('priority').value;

        const appointmentData = {name, email, phone, doctor, date, time, reason, priority}; // Store appointment data

        // Create an appointment item
        const appointmentItem = document.createElement('div');
        appointmentItem.classList.add('appointment-item');

        // Create a cancel button
        const cancelButton = document.createElement('button');
        cancelButton.classList.add('cancel-button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', function() {
            cancelAppointment(appointmentItem, appointmentData);  // Pass data to cancel function
        });

        appointmentItem.innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Doctor:</strong> ${getDoctorName(doctor)}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p><strong>Priority:</strong> ${priority}</p>
        `;

        appointmentItem.appendChild(cancelButton); // Add cancel button to the item
        appointmentList.appendChild(appointmentItem);
        appointmentForm.reset();

        // Save appointment data
        saveAppointment(appointmentData);

        // Create and display reminder
        createReminder(name, date, time, doctor);
    });

    function getDoctorName(doctorValue) {
        switch (doctorValue) {
            case 'dr_smith':
                return 'Dr. John Smith';
            case 'dr_lee':
                return 'Dr. Jane Lee';
            default:
                return 'Unknown Doctor';
        }
    }

    function saveAppointment(appointment) {
        let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    function loadAppointments() {
        let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.forEach(appointment => {
            const appointmentItem = document.createElement('div');
            appointmentItem.classList.add('appointment-item');

            const cancelButton = document.createElement('button');
            cancelButton.classList.add('cancel-button');
            cancelButton.textContent = 'Cancel';
            cancelButton.addEventListener('click', function() {
                cancelAppointment(appointmentItem, appointment);  //Pass appontment data to cancel function
            });

            appointmentItem.innerHTML = `
                <p><strong>Name:</strong> ${appointment.name}</p>
                <p><strong>Email:</strong> ${appointment.email}</p>
                <p><strong>Phone:</strong> ${appointment.phone}</p>
                <p><strong>Doctor:</strong> ${getDoctorName(appointment.doctor)}</p>
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Reason:</strong> ${appointment.reason}</p>
                <p><strong>Priority:</strong> ${appointment.priority}</p>
            `;

            appointmentItem.appendChild(cancelButton);
            appointmentList.appendChild(appointmentItem);
        });
    }

    function createReminder(patientName, appointmentDate, appointmentTime, doctorName) {
        const reminderItem = document.createElement('div');
        reminderItem.classList.add('reminder-item');

        const daysLeft = calculateDaysLeft(appointmentDate);

        reminderItem.innerHTML = `
            <p><strong>Appointment Reminder!</strong></p>
            <p>Patient: ${patientName}</p>
            <p>Doctor: ${doctorName}</p>
            <p>Date: ${appointmentDate}</p>
            <p>Time: ${appointmentTime}</p>
            <p><strong>${daysLeft} days left</strong> until your appointment.</p>
        `;

        reminderList.appendChild(reminderItem);
    }

    function calculateDaysLeft(appointmentDate) {
        const appointmentDateTime = new Date(appointmentDate);
        const now = new Date();
        const difference = appointmentDateTime.getTime() - now.getTime();
        const days = Math.ceil(difference / (1000 * 3600 * 24));
        return days;
    }

    // Function to cancel the appointment
    function cancelAppointment(appointmentItem, appointmentData) {
        appointmentItem.remove(); // Remove from the display

        //Remove from local storage
        removeAppointment(appointmentData);
    }

    //Function to remove appointment from local storage
    function removeAppointment(appointmentToRemove){
      let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

      appointments = appointments.filter(appointment => {
          return !(
              appointment.name === appointmentToRemove.name &&
              appointment.email === appointmentToRemove.email &&
              appointment.phone === appointmentToRemove.phone &&
              appointment.doctor === appointmentToRemove.doctor &&
              appointment.date === appointmentToRemove.date &&
              appointment.time === appointmentToRemove.time &&
              appointment.reason === appointmentToRemove.reason &&
              appointment.priority === appointmentToRemove.priority
          );
      });

      localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    loadAppointments();
});

