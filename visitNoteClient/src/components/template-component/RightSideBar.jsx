import { Card, List, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { BarChartList } from "./style";

const chartItems = [
  {
    title: "Medications",
    list: [
      {
        listItem: "Lisinotril",
      },
      {
        listItem: "Omeprazole",
      },
      {
        listItem: "Lamotrigine",
      },
    ],
  },
  {
    title: "Allergies",
    list: [
      {
        listItem: "Doxycycline",
      },
      {
        listItem: "Penicilline",
      },
    ],
  },
  {
    title: "Medical History",
    list: [
      {
        listItem: "Hypertension",
      },
      {
        listItem: "Epilepsy",
      },
    ],
  },
  {
    title: "Surgical History",
    list: [
      {
        listItem: "Appendectomy",
      },
      {
        listItem: "Tonsilectomy",
      },
    ],
  },
  {
    title: "Social History",
    list: [
      {
        listItem: "Non-Smoker",
      },
      {
        listItem: "Social Drinker",
      },
      {
        listItem: "Non-drug User",
      },
    ],
  },
  {
    title: "Family History",
    list: [
      {
        listItem: "Hypertention - Parent",
      },
      {
        listItem: "Stroke - Patent",
      },
      {
        listItem: "Diabetes - Sibling",
      },
    ],
  },
  {
    title: "Review of Systems",
    list: [
      {
        listItem: "Constitutional",
        listSubItem: [
          {
            subItem: "None",
          },
        ],
      },
      {
        listItem: "Musculoskeletal",
        listSubItem: [
          {
            subItem: "Joint pain - foot",
          },
        ],
      },
      {
        listItem: "Cardiovascular",
        listSubItem: [
          {
            subItem: "Hypertension",
          },
        ],
      },
      {
        listItem: "Neurologic",
        listSubItem: [
          {
            subItem: "None",
          },
        ],
      },
      {
        listItem: "Dermatology",
        listSubItem: [
          {
            subItem: "None",
          },
        ],
      },
      {
        listItem: "Endocrine",
        listSubItem: [
          {
            subItem: "None",
          },
        ],
      },
    ],
  },
  {
    title: "BMI",
    list: [
      {
        listItem: "32.2",
      },
    ],
  },
];
export const RightSideBar = () => {
  return (
    <Card style={{ marginBottom: 16 }}>
      <BarChartList>
        <div className="chartList-items">
          {chartItems.map((items, index) => {
            return (
              <div className="chart-item" key={index}>
                <Typography.Title level={5}>
                  {items.title} <EditOutlined />
                </Typography.Title>

                <List
                  itemLayout="horizontal"
                  dataSource={items.list}
                  renderItem={(item, index) => (
                    <>
                      <List.Item key={index}>{item.listItem}</List.Item>
                      {item.listSubItem ? (
                        <List
                          itemLayout="horizontal"
                          dataSource={item.listSubItem}
                          renderItem={(item, index) => (
                            <List.Item key={index}>{item.subItem}</List.Item>
                          )}
                        />
                      ) : null}
                    </>
                  )}
                />
              </div>
            );
          })}
        </div>
      </BarChartList>
    </Card>
  );
};
