import React, { useState } from "react";
import Modal from "../../shared/webcontrols//Modal";
import Input from "../../shared/webcontrols//Input";
import Button from "../../shared/webcontrols//Button";
import Datepicker from "../../shared/webcontrols//Datepicker";
import Dropdownlist from "../../shared/webcontrols/Dropdownlist";

// Define the type for datasource_columns
interface DataSourceColumn {
  title: string;
  field: string;
  sorter?: "string" | "number";
  value?: string | any;
  mode: {
    [key: string]: {
      visible: boolean;
      required?: boolean;
      ele?: {
        component: string;
        type?: string;
        dataSource?: any[] | null;
        dataTextField?: string;
        dataTextValue?: string;
        pattern?: string;
        value?: string;
      };
    };
  };
}

interface FromViewProps {
  record: Record<string, any>;
  onCancel: () => void;
  onSave: (updatedRecord: Record<string, any>) => void;
  datasource_columns?: DataSourceColumn[];
  mode?: string; // "update" or "create"
}

const FromView: React.FC<FromViewProps> = ({
  record,
  onCancel,
  onSave,
  datasource_columns = [],
  mode = "update",
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({ ...record });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getFieldValue = (field: string): string => {
    return (formData[field] || "").toString();
  };

  const handleSave = () => {
    const missingFields = datasource_columns
      .filter((col) => col.mode[mode]?.required && !getFieldValue(col.field))
      .map((col) => col.title);

    if (missingFields.length > 0) {
      setErrorMessage(
        `Please fill in the following required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    onSave(formData);
    onCancel();
  };

  const renderComponent = (column: DataSourceColumn) => {
    const field = column.field;
    const title = column.title;
    const ele = column.mode[mode]?.ele?.component;

    switch (ele) {
      case "Input":
        return (
          <Input
            key={field}
            label={title}
            name={field}
            value={getFieldValue(field)}
            onChange={(e) => handleChange(field, e.target.value)}
            type={column.mode[mode]?.ele?.type || "text"}
          />
        );

      case "Dropdownlist":
        return (
          <Dropdownlist
            key={field}
            label={title}
            name={field}
            onChange={(e) => handleChange(field, e.target.value)}
            dataSource={column.mode[mode]?.ele?.dataSource || []}
            dataTextField={column.mode[mode]?.ele?.dataTextField || ""}
            dataTextValue={column.mode[mode]?.ele?.dataTextValue || ""}
            selectedValue={getFieldValue(field)}
          />
        );

      case "Datepicker":
        return (
          <Datepicker
            key={field}
            label={title}
            name={field}
            value={getFieldValue(field)}
            onChange={(e) => handleChange(field, e.target.value)}
            pattern={column.mode[mode]?.ele?.pattern || "YYYY-MM-DD"}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal title="Form" isOpen={true} onClose={onCancel}>
      <div>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        {datasource_columns
          .filter((col) => col.mode[mode]?.visible)
          .map((column) => renderComponent(column))}
        <div className="flex gap-4 mt-4">
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FromView;
