import useAxios from 'axios-hooks';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import axios from '../util/axios';

const BumpChart = (props: any) => {
    const [moistureLines, setMoistureLines] = useState([]);
    const [{ data: moistureData }] = useAxios({
        url: '/moisture_reading',
        params: {
          timeFrom: '1d'
        }
    });

    useEffect(() => {
        if (!moistureData)
            return;
        // @ts-ignore
        setMoistureLines(getLineIds(moistureData))
    }, [ moistureData ]);

    function getLineIds(data: any[]) {
        const distinct: any[] = [];
        for (const element of data) {
            if (!distinct.includes(element.sensor))
                distinct.push(element.sensor);
        }
        return distinct;
    }

    function formatXAxis(tickItem: any) {
        return moment(tickItem).format('MM-DD-YYYY HH:mm:ss');
    }

    async function submitWateringRequest() {
        console.log('fal');
        await axios({
            method: 'POST',
            url: '/water_plant'
        });
    }

    return (
        <Container>
            <Title>Moisture</Title>
            <ResponsiveContainer width="90%" height="50%">
                <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="created_at" tickFormatter={formatXAxis} domain={['auto', 'auto']}/>
                    <YAxis dataKey="reading" type="number" domain={[300, 600]}/>
                    <Tooltip/>
                    <Legend/>
                    {
                        moistureLines.map(lineId => {
                            return <Line key={lineId} name={lineId} dataKey="reading" data={moistureData.filter((d: any) => d.sensor === lineId)}/>
                        })
                    }
                </LineChart>
            </ResponsiveContainer>
            {/* @ts-ignore */}
            <button onClick={() => submitWateringRequest()}>water plant</button>
        </Container>
    )
}

const Container = styled.div`
    flex-direction: column;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
`;

const Title = styled.h1`

`;

export default BumpChart;
