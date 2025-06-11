// components/SetupProgressCard.tsx
import React from "react";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import ListGroup from "react-bootstrap/ListGroup";
import { CheckCircleFill, Circle } from "react-bootstrap-icons";

type Step = {
  title: string;
  completed: boolean;
};

type Props = {
  steps: Step[];
};

const SetupProgressCard: React.FC<Props> = ({ steps }) => {
  const total = steps.length;
  const doneCount = steps.filter((s) => s.completed).length;
  const percent = Math.round((doneCount / total) * 100);

  return (
    <Card style={{ maxWidth: 400 }} className="mb-4">
      <Card.Header as="h5">Complete your setup</Card.Header>
      <Card.Body>
        {/* Progress bar */}
        <ProgressBar now={percent} label={`${percent}%`} className="mb-2" />
        <div className="text-muted small mb-3">
          {doneCount} of {total} completed
        </div>

        {/* Steps list */}
        <ListGroup variant="flush">
          {steps.map((step, idx) => (
            <ListGroup.Item key={idx} className="d-flex align-items-center">
              {step.completed ? (
                <CheckCircleFill className="text-success me-2" />
              ) : (
                <Circle className="text-secondary me-2" />
              )}
              <span
                className={
                  step.completed
                    ? "text-muted text-decoration-line-through"
                    : ""
                }
              >
                {step.title}
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default SetupProgressCard;
