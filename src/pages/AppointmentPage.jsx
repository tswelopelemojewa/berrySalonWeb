import { Card, Col, Row } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";

const statusColors = {
  Pending: "#fff8e1",
  confirmed: "#e8f5e9",
  cancelled: "#ffebee",
  complete: "#e3f2fd"
};

export default function AppointmentPage({ appointments }) {
  return (
    <>
      <h3 className="mb-4">Your Upcoming Appointments</h3>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {appointments.map((a) => (
          <Col key={a.id}>
            <Card
              className="h-100 text-center shadow-sm"
              style={{
                backgroundColor: statusColors[a.status] || "white",
                borderRadius: "12px",
              }}
            >
              <Card.Body>
                <h4 style={{ fontWeight: "600" }}>{a.service_name}</h4>

                <p>
                  <a
                    href={`https://wa.me/${a.user_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-dark"
                  >
                    <FaWhatsapp size={22} className="text-success" />{" "}
                    {a.user_number}
                  </a>
                </p>

                <h5>{formatDate(a.appointment_date)}</h5>
                <p>{a.StartTime} - {a.EndTime}</p>

                <p
                  style={{
                    fontWeight: "600",
                    opacity: 0.7,
                    textTransform: "capitalize",
                  }}
                >
                  {a.status}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
