import { Col, Form, Row } from "react-bootstrap";

const CreateExam = () => {
    return (
        <>
            <Form>
                <Row>
                    <Col sm={12} md={6}>
                        <Form.Label htmlFor="standard">Standard</Form.Label>
                        <Form.Control type="text" size="lg" id="standard" className="" />
                    </Col>
                    <Col sm={12} md={6}>
                        <Form.Label htmlFor="dateSelection">Date selection</Form.Label>
                        <Form.Control type="text" size="lg" id="dateSelection" />
                    </Col>
                    <Col sm={12} md={4}>
                        <Form.Label htmlFor="selectSubject">Select Subject</Form.Label>
                        <Form.Control type="text" size="lg" id="selectSubject" />
                    </Col>
                    <Col sm={12} md={4}>
                        <Form.Label htmlFor="totalMarks">Total Marks</Form.Label>
                        <Form.Control type="text" size="lg" id="totalMarks" />
                    </Col>
                    <Col sm={12} md={4}>
                        <Form.Label htmlFor="testNumber">Test Number</Form.Label>
                        <Form.Control type="text" size="lg" id="testNumber" />
                    </Col>
                    <Col sm={12}>
                        <Form.Label htmlFor="notes">Notes</Form.Label>
                        <Form.Control as="textarea" size="lg" id="note" />
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default CreateExam;
