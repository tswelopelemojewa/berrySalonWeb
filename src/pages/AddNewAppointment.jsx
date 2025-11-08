
import React, { useState, useEffect, useMemo } from 'react';
import { Form, Row, Col, Button, ButtonGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const baseURL = 'https://berrysalon.onrender.com';

const TimeSlotSelector = ({ date, serviceDurationMinutes, onSelectTime }) => {
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  // Fetch upcoming appointments (we'll filter client-side by date)
  useEffect(() => {
    if (!date) {
      setAppointments([]);
      return;
    }
    setLoading(true);
    setError('');
    axios
      .get(`${baseURL}/upcoming/appointments/` )
      .then((res) => {
        // ensure array (if API returns single object, normalize)
        const data = Array.isArray(res.data) ? res.data : [res.data];
        // filter appointments that match selected date in appointment_date or appointment_start
        const filtered = data.filter((a) => {
          if (!a) return false;
          // prefer explicit appointment_date field
          if (a.appointment_date) return a.appointment_date === date;
          // fallback: parse appointment_start "YYYY-MM-DD HH:MM:SS"
          if (a.appointment_start) {
            return a.appointment_start.startsWith(date);
          }
          return false;
        });
        setAppointments(filtered);
      })
      .catch((err) => {
        console.error('Error fetching appointments:', err);
        setError('Could not load existing appointments.');
      })
      .finally(() => setLoading(false));
  }, [date]);

  // Generate slots across 24 hours based on service duration
const slots = useMemo(() => {
  if (!date || !serviceDurationMinutes || serviceDurationMinutes <= 0) return [];

  const minutesInDay = 24 * 60;
  const slotCount = Math.ceil(minutesInDay / serviceDurationMinutes);
  const baseDate = new Date(`${date}T00:00:00`); // local timezone

  let startMinutes = 0;

  // If selected date is today, start from current time rounded up to nearest service duration
  const today = new Date();
  const selectedDateObj = new Date(`${date}T00:00:00`);
  if (
    today.getFullYear() === selectedDateObj.getFullYear() &&
    today.getMonth() === selectedDateObj.getMonth() &&
    today.getDate() === selectedDateObj.getDate()
  ) {
    const currentTotalMinutes = today.getHours() * 60 + today.getMinutes();
    // round up to next multiple of serviceDurationMinutes
    startMinutes = Math.ceil(currentTotalMinutes / serviceDurationMinutes) * serviceDurationMinutes;
  }

  const list = [];
  for (let i = 0; i < slotCount; i++) {
    const minutesOffset = startMinutes + i * serviceDurationMinutes;
    const start = new Date(baseDate.getTime() + minutesOffset * 60000);
    const end = new Date(start.getTime() + serviceDurationMinutes * 60000);
    // stop adding slots after 24 hours (prevents going over multiple days unintentionally)
    if (start.getTime() - baseDate.getTime() >= minutesInDay * 60000) break;
    list.push({ start, end });
  }

  return list;
}, [date, serviceDurationMinutes]);


  // parse appointment times into Date objects for overlap checking
  const parsedAppointments = useMemo(() => {
    return (appointments || []).map((a) => {
      // prefer appointment_start and appointment_end (format: "YYYY-MM-DD HH:MM:SS")
      const parse = (s) => {
        if (!s) return null;
        // convert to ISO-like string
        const t = s.replace(' ', 'T');
        return new Date(t);
      };
      return {
        start: parse(a.appointment_start) || (a.appointment_date ? new Date(`${a.appointment_date}T00:00:00`) : null),
        end: parse(a.appointment_end) || null,
        raw: a
      };
    }).filter(x => x.start && x.end);
  }, [appointments]);

  const isSlotBooked = (slot) => {
    // booked if overlaps any appointment
    return parsedAppointments.some((appt) => {
      // overlap: slot.start < appt.end && slot.end > appt.start
      return slot.start < appt.end && slot.end > appt.start;
    });
  };

  const formatTime = (dateObj) => {
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const mm = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  // === MODIFICATION 1: Set minHeight to 250px to match the new grid height ===
  return (
    <div style={{ marginTop: 12, minHeight: '250px' }}>
      {!date ? (
        <Alert variant="info">Select service & date to see available time slots.</Alert>
      ) : !serviceDurationMinutes ? (
        <Alert variant="warning">Select a service to determine slot duration.</Alert>
      ) : (
        <div>
          <div className="d-flex align-items-center mb-2">
            <strong style={{ marginRight: 12 }}>Time slots ({formatTime(new Date(`${date}T00:00:00`))} → next day)</strong>
            <Badge bg="success" className="me-1">Available</Badge>
            <Badge bg="danger" className="me-3">Booked</Badge>
            <small className="text-muted">Click an available slot to auto-fill the Time field.</small>
          </div>

          {loading && (
            <div className="mb-2"><Spinner animation="border" size="sm" /> Loading appointments...</div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* === MODIFICATION 2: Changed to a vertical-scrolling flex-wrap grid === */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',     // Makes items wrap to new lines
              overflowY: 'auto',    // Makes the container scroll vertically
              maxHeight: '250px',   // Sets a fixed height for the scrolling area
              padding: '8px',
              gap: 8,
              border: '1px solid #e9ecef',
              borderRadius: 6,
              background: '#ffffff'
            }}
          >
            {slots.map((slot, idx) => {
              const booked = isSlotBooked(slot);
              // mark realistic booking hours visually (dim outside 05:00-22:00)
              const hour = slot.start.getHours();
              const isRealistic = hour >= 5 && hour <= 22;
              return (
                <Button
                  key={idx}
                  size="sm"
                  variant={booked ? 'danger' : 'success'}
                  // === MODIFICATION 3: Changed to flex-basis to act like grid cards ===
                  style={{
                    flexGrow: 1,          // Allows button to grow and fill space
                    flexBasis: '90px',    // Sets the base width before growing
                    whiteSpace: 'nowrap',
                    opacity: isRealistic ? 1 : 0.55,
                    borderRadius: 6,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  disabled={booked}
                  onClick={() => onSelectTime(formatTime(slot.start))}
                  title={`${formatTime(slot.start)} → ${formatTime(slot.end)}${!isRealistic ? ' (outside typical hours)' : ''}`}
                >
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{formatTime(slot.start)}</div>
                  <div style={{ fontSize: 11, opacity: 0.9 }}>{formatTime(slot.end)}</div>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const AddNewAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    user_number: '',
    serviceId: '',
    date: '',
    time: ''
  });
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch available services
  useEffect(() => {
    axios
      .get(`${baseURL}/services`)
      .then((res) => setServices(Array.isArray(res.data) ? res.data : [res.data]))
      .catch((err) => console.error('Error fetching services:', err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${baseURL}/new/appointments`, formData);
      alert('Appointment created successfully!');
      setFormData({
        name: '',
        user_number: '',
        serviceId: '',
        date: '',
        time: ''
      });

      navigate('/ConfirmBooking');

    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.error || 'That slot is already booked.');
      } else {
        setError('Something went wrong, please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // find selected service duration (in minutes)
  const selectedService = services.find((s) => String(s.id) === String(formData.serviceId));
  const serviceDurationMinutes =
    selectedService?.duration_minutes ||
    selectedService?.duration ||
    selectedService?.durationMinutes ||
    null; // leave null if none found

  // Called when user clicks a slot in timeline
  const handleSlotSelect = (hhmm) => {
    setFormData((p) => ({ ...p, time: hhmm }));
  };

  return (
    <div className="form-control" style={{ maxWidth: '800px', margin: 'auto', padding: '30px' }}>
      <h3 style={{ paddingBottom: '16px' }}>Add New Appointment</h3>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Name */}
        <div style={{ marginBottom: '10px' }}>
          <Form.Group as={Row} className="mb-2" controlId="formName">
            <Form.Label column sm="3">Name:</Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
        </div>

        {/* User Number */}
        <div style={{ marginBottom: '10px' }}>
          <Form.Group as={Row} className="mb-2" controlId="formNumber">
            <Form.Label column sm="3">Number:</Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                name="user_number"
                placeholder="e.g. 27831234567"
                value={formData.user_number}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
        </div>

        {/* Service Dropdown */}
        <div style={{ marginBottom: '10px' }}>
          <Form.Group as={Row} className="mb-2" controlId="formService">
            <Form.Label column sm="3">Service:</Form.Label>
            <Col sm="9">
              <Form.Select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a Service --</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} {service.duration_minutes ? `(${service.duration_minutes}m)` : ''}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
        </div>

        {/* Date Picker */}
        <div style={{ marginBottom: '10px' }}>
          <Form.Group as={Row} className="mb-2" controlId="formDate">
            <Form.Label column sm="3">Date:</Form.Label>
            <Col sm="9">
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
        </div>

        {/* Timeline selector under date picker */}
        <div style={{ marginBottom: '10px' }}>
          {/* This Col is now stable and does not need inline styles */}
          <Col sm={{ span: 9, offset: 3 }}>
            <TimeSlotSelector
              date={formData.date}
              serviceDurationMinutes={serviceDurationMinutes}
              onSelectTime={handleSlotSelect}
            />
          </Col>
        </div>

        {/* Time Picker (filled when user clicks a slot) */}
        <div style={{ marginBottom: '10px' }}>
          <Form.Group as={Row} className="mb-2" controlId="formTime">
            <Form.Label column sm="3">Time:</Form.Label>
            <Col sm="9">
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ marginTop: '10px' }} className="btn btn-success" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Add Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewAppointment;
// import React, { useState, useEffect, useMemo } from 'react';
// import { Form, Row, Col, Button, ButtonGroup, Badge, Spinner, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import axiosClient from '../api/axiosClient';

// const baseURL = 'https://berrysalon.onrender.com';

// const TimeSlotSelector = ({ date, serviceDurationMinutes, onSelectTime }) => {
  
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
 
//   // Fetch upcoming appointments (we'll filter client-side by date)
//   useEffect(() => {
//     if (!date) {
//       setAppointments([]);
//       return;
//     }
//     setLoading(true);
//     setError('');
//     axios
//       .get(`${baseURL}/upcoming/appointments/` )
//       .then((res) => {
//         // ensure array (if API returns single object, normalize)
//         const data = Array.isArray(res.data) ? res.data : [res.data];
//         // filter appointments that match selected date in appointment_date or appointment_start
//         const filtered = data.filter((a) => {
//           if (!a) return false;
//           // prefer explicit appointment_date field
//           if (a.appointment_date) return a.appointment_date === date;
//           // fallback: parse appointment_start "YYYY-MM-DD HH:MM:SS"
//           if (a.appointment_start) {
//             return a.appointment_start.startsWith(date);
//           }
//           return false;
//         });
//         setAppointments(filtered);
//       })
//       .catch((err) => {
//         console.error('Error fetching appointments:', err);
//         setError('Could not load existing appointments.');
//       })
//       .finally(() => setLoading(false));
//   }, [date]);

//   // Generate slots across 24 hours based on service duration
//   // const slots = useMemo(() => {
//   //   if (!date || !serviceDurationMinutes || serviceDurationMinutes <= 0) return [];

//   //   const minutesInDay = 24 * 60;
//   //   const slotCount = Math.ceil(minutesInDay / serviceDurationMinutes);
//   //   const baseDate = new Date(`${date}T00:00:00`); // local timezone
//   //   const list = [];

//   //   for (let i = 0; i < slotCount; i++) {
//   //     const start = new Date(baseDate.getTime() + i * serviceDurationMinutes * 60000);
//   //     const end = new Date(start.getTime() + serviceDurationMinutes * 60000);
//   //     list.push({ start, end });
//   //   }
//   //   return list;
//   // }, [date, serviceDurationMinutes]);

//   // Generate slots across 24 hours based on service duration
// const slots = useMemo(() => {
//   if (!date || !serviceDurationMinutes || serviceDurationMinutes <= 0) return [];

//   const minutesInDay = 24 * 60;
//   const slotCount = Math.ceil(minutesInDay / serviceDurationMinutes);
//   const baseDate = new Date(`${date}T00:00:00`); // local timezone

//   let startMinutes = 0;

//   // If selected date is today, start from current time rounded up to nearest service duration
//   const today = new Date();
//   const selectedDateObj = new Date(`${date}T00:00:00`);
//   if (
//     today.getFullYear() === selectedDateObj.getFullYear() &&
//     today.getMonth() === selectedDateObj.getMonth() &&
//     today.getDate() === selectedDateObj.getDate()
//   ) {
//     const currentTotalMinutes = today.getHours() * 60 + today.getMinutes();
//     // round up to next multiple of serviceDurationMinutes
//     startMinutes = Math.ceil(currentTotalMinutes / serviceDurationMinutes) * serviceDurationMinutes;
//   }

//   const list = [];
//   for (let i = 0; i < slotCount; i++) {
//     const minutesOffset = startMinutes + i * serviceDurationMinutes;
//     const start = new Date(baseDate.getTime() + minutesOffset * 60000);
//     const end = new Date(start.getTime() + serviceDurationMinutes * 60000);
//     // stop adding slots after 24 hours (prevents going over multiple days unintentionally)
//     if (start.getTime() - baseDate.getTime() >= minutesInDay * 60000) break;
//     list.push({ start, end });
//   }

//   return list;
// }, [date, serviceDurationMinutes]);


//   // parse appointment times into Date objects for overlap checking
//   const parsedAppointments = useMemo(() => {
//     return (appointments || []).map((a) => {
//       // prefer appointment_start and appointment_end (format: "YYYY-MM-DD HH:MM:SS")
//       const parse = (s) => {
//         if (!s) return null;
//         // convert to ISO-like string
//         const t = s.replace(' ', 'T');
//         return new Date(t);
//       };
//       return {
//         start: parse(a.appointment_start) || (a.appointment_date ? new Date(`${a.appointment_date}T00:00:00`) : null),
//         end: parse(a.appointment_end) || null,
//         raw: a
//       };
//     }).filter(x => x.start && x.end);
//   }, [appointments]);

//   const isSlotBooked = (slot) => {
//     // booked if overlaps any appointment
//     return parsedAppointments.some((appt) => {
//       // overlap: slot.start < appt.end && slot.end > appt.start
//       return slot.start < appt.end && slot.end > appt.start;
//     });
//   };

//   const formatTime = (dateObj) => {
//     const hh = String(dateObj.getHours()).padStart(2, '0');
//     const mm = String(dateObj.getMinutes()).padStart(2, '0');
//     return `${hh}:${mm}`;
//   };

//   if (!date) {
//     return <Alert variant="info">Select service & date to see available time slots.</Alert>;
//   }

//   if (!serviceDurationMinutes) {
//     return <Alert variant="warning">Select a service to determine slot duration.</Alert>;
//   }

//   return (
//     <div style={{ marginTop: 12 }}>
//       <div className="d-flex align-items-center mb-2">
//         <strong style={{ marginRight: 12 }}>Time slots ({formatTime(new Date(`${date}T00:00:00`))} → next day)</strong>
//         <Badge bg="success" className="me-1">Available</Badge>
//         <Badge bg="danger" className="me-3">Booked</Badge>
//         <small className="text-muted">Click an available slot to auto-fill the Time field.</small>
//       </div>

//       {loading && (
//         <div className="mb-2"><Spinner animation="border" size="sm" /> Loading appointments...</div>
//       )}
//       {error && <Alert variant="danger">{error}</Alert>}

//       {/* Timeline container */}
//       <div
//         style={{
//           display: 'flex',
//           overflowX: 'auto',
//           padding: '8px 4px',
//           gap: 6,
//           border: '1px solid #e9ecef',
//           borderRadius: 6,
//           background: '#ffffff'
//         }}
//       >
//         {slots.map((slot, idx) => {
//           const booked = isSlotBooked(slot);
//           // mark realistic booking hours visually (dim outside 05:00-22:00)
//           const hour = slot.start.getHours();
//           const isRealistic = hour >= 5 && hour <= 22;
//           return (
//             <Button
//               key={idx}
//               size="sm"
//               variant={booked ? 'danger' : 'success'}
//               style={{
//                 minWidth: 90,
//                 whiteSpace: 'nowrap',
//                 opacity: isRealistic ? 1 : 0.55,
//                 borderRadius: 6,
//                 boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//               }}
//               disabled={booked}
//               onClick={() => onSelectTime(formatTime(slot.start))}
//               title={`${formatTime(slot.start)} → ${formatTime(slot.end)}${!isRealistic ? ' (outside typical hours)' : ''}`}
//             >
//               <div style={{ fontSize: 12, fontWeight: 600 }}>{formatTime(slot.start)}</div>
//               <div style={{ fontSize: 11, opacity: 0.9 }}>{formatTime(slot.end)}</div>
//             </Button>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const AddNewAppointment = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     user_number: '',
//     serviceId: '',
//     date: '',
//     time: ''
//   });
//   const [services, setServices] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Fetch available services
//   useEffect(() => {
//     axios
//       .get(`${baseURL}/services`)
//       .then((res) => setServices(Array.isArray(res.data) ? res.data : [res.data]))
//       .catch((err) => console.error('Error fetching services:', err));
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       await axios.post(`${baseURL}/new/appointments`, formData);
//       alert('Appointment created successfully!');
//       setFormData({
//         name: '',
//         user_number: '',
//         serviceId: '',
//         date: '',
//         time: ''
//       });

//       navigate('/ConfirmBooking');

//     } catch (err) {
//       if (err.response?.status === 400) {
//         setError(err.response.data.error || 'That slot is already booked.');
//       } else {
//         setError('Something went wrong, please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // find selected service duration (in minutes)
//   const selectedService = services.find((s) => String(s.id) === String(formData.serviceId));
//   const serviceDurationMinutes =
//     selectedService?.duration_minutes ||
//     selectedService?.duration ||
//     selectedService?.durationMinutes ||
//     null; // leave null if none found

//   // Called when user clicks a slot in timeline
//   const handleSlotSelect = (hhmm) => {
//     setFormData((p) => ({ ...p, time: hhmm }));
//   };

//   return (
//     <div className="form-control" style={{ maxWidth: '800px', margin: 'auto', padding: '30px' }}>
//       <h3 style={{ paddingBottom: '16px' }}>Add New Appointment</h3>

//       <form onSubmit={handleSubmit}>
//         {error && <p style={{ color: 'red' }}>{error}</p>}

//         {/* Name */}
//         <div style={{ marginBottom: '10px' }}>
//           <Form.Group as={Row} className="mb-2" controlId="formName">
//             <Form.Label column sm="3">Name:</Form.Label>
//             <Col sm="9">
//               <Form.Control
//                 type="text"
//                 name="name"
//                 placeholder="Enter name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </Col>
//           </Form.Group>
//         </div>

//         {/* User Number */}
//         <div style={{ marginBottom: '10px' }}>
//           <Form.Group as={Row} className="mb-2" controlId="formNumber">
//             <Form.Label column sm="3">Number:</Form.Label>
//             <Col sm="9">
//               <Form.Control
//                 type="text"
//                 name="user_number"
//                 placeholder="e.g. 27831234567"
//                 value={formData.user_number}
//                 onChange={handleChange}
//                 required
//               />
//             </Col>
//           </Form.Group>
//         </div>

//         {/* Service Dropdown */}
//         <div style={{ marginBottom: '10px' }}>
//           <Form.Group as={Row} className="mb-2" controlId="formService">
//             <Form.Label column sm="3">Service:</Form.Label>
//             <Col sm="9">
//               <Form.Select
//                 name="serviceId"
//                 value={formData.serviceId}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">-- Select a Service --</option>
//                 {services.map((service) => (
//                   <option key={service.id} value={service.id}>
//                     {service.name} {service.duration_minutes ? `(${service.duration_minutes}m)` : ''}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Col>
//           </Form.Group>
//         </div>

//         {/* Date Picker */}
//         <div style={{ marginBottom: '10px' }}>
//           <Form.Group as={Row} className="mb-2" controlId="formDate">
//             <Form.Label column sm="3">Date:</Form.Label>
//             <Col sm="9">
//               <Form.Control
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//               />
//             </Col>
//           </Form.Group>
//         </div>

//         {/* Timeline selector under date picker */}
//         <div style={{ marginBottom: '10px' }}>
//           <Col sm={{ span: 9, offset: 3 }}>
//             <TimeSlotSelector
//               date={formData.date}
//               serviceDurationMinutes={serviceDurationMinutes}
//               onSelectTime={handleSlotSelect}
//             />
//           </Col>
//         </div>

//         {/* Time Picker (filled when user clicks a slot) */}
//         <div style={{ marginBottom: '10px' }}>
//           <Form.Group as={Row} className="mb-2" controlId="formTime">
//             <Form.Label column sm="3">Time:</Form.Label>
//             <Col sm="9">
//               <Form.Control
//                 type="time"
//                 name="time"
//                 value={formData.time}
//                 onChange={handleChange}
//                 required
//               />
//             </Col>
//           </Form.Group>
//         </div>

//         {/* Submit */}
//         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//           <button style={{ marginTop: '10px' }} className="btn btn-success" type="submit" disabled={loading}>
//             {loading ? 'Saving...' : 'Add Appointment'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddNewAppointment;
