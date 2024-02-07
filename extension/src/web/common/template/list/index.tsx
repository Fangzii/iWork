import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button } from 'semantic-ui-react';
import { TemplateDetail } from '../detail';
import { http } from '../../../../pages/utils/http';
interface Props {
  onClick: CallableFunction;
  defaultCreate?: boolean;
}
export function TemplateTable({ onClick, defaultCreate = false }: Props) {
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(defaultCreate);
  const career = useSelector((state: any) => state.myInfo.career);

  const getTemplates = async () => {
    const response = await http.get(`/api/get_templates/${career.id}/`);
    setData(response.data);
  };

  useEffect(() => {
    getTemplates();
  }, []);

  return (
    <div style={{ marginLeft: '18px' }}>
      {create ? (
        <>
          <TemplateDetail
            onComplete={() => (getTemplates(), setCreate(false))}
            title="添加指令"
          ></TemplateDetail>
        </>
      ) : (
        <>
          <Button
            compact
            style={{
              float: 'right',
              top: '-8px',
              position: 'relative',
            }}
            color="teal"
            onClick={() => setCreate(true)}
          >
            添加指令
          </Button>
          <Table celled compact selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>指令名称</Table.HeaderCell>
                <Table.HeaderCell>指令简介</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data.map((item: any, index) => (
                <Table.Row
                  key={index}
                  onClick={() => onClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <Table.Cell>
                    {/* <Label ribbon>First</Label> */}
                    {item.name}
                  </Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      )}
    </div>
  );
}
