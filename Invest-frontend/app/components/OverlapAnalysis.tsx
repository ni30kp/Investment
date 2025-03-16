'use client';

import { useEffect, useRef, useState } from 'react';

interface Fund {
    id: string;
    name: string;
    color: string;
}

interface OverlapData {
    funds: { id: number; name: string }[];
    stocksOverlap: number;
    averageOverlapPercentage: number;
    commonStocks: string[];
}

interface FundPair {
    fund1: number;
    fund2: number;
    data: OverlapData;
}

interface OverlapAnalysisProps {
    funds?: Fund[];
    commonStocks?: string[];
    overlapPairs?: FundPair[];
}

export default function OverlapAnalysis({
    funds = [
        { id: '1', name: 'Axis Bluechip Fund', color: '#FFD700' },
        { id: '2', name: 'HDFC Top 100 Fund', color: '#4169E1' },
        { id: '3', name: 'ICICI Prudential Bluechip Fund', color: '#32CD32' },
        { id: '4', name: 'SBI Bluechip Fund', color: '#FF6347' }
    ],
    commonStocks = [
        'HDFC LTD.',
        'RIL',
        'INFY',
        'TCS',
        'HDFCBANK',
        'BHARTIARTL'
    ],
    overlapPairs = []
}: OverlapAnalysisProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setCanvasSize({
                    width: containerRef.current.offsetWidth,
                    height: 500 // Increased height to accommodate more funds
                });
            }
        };

        // Initial size
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Draw the visualization when canvas size changes
    useEffect(() => {
        if (!canvasRef.current || canvasSize.width === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions with device pixel ratio for sharper rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvasSize.width * dpr;
        canvas.height = canvasSize.height * dpr;

        // Scale all drawing operations
        ctx.scale(dpr, dpr);

        // Set display size
        canvas.style.width = `${canvasSize.width}px`;
        canvas.style.height = `${canvasSize.height}px`;

        // Clear canvas
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

        // Draw the overlap visualization
        drawOverlapVisualization(ctx, canvasSize.width, canvasSize.height, funds, commonStocks, overlapPairs);
    }, [funds, commonStocks, overlapPairs, canvasSize]);

    // Function to draw the overlap visualization
    const drawOverlapVisualization = (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        funds: Fund[],
        commonStocks: string[],
        overlapPairs: FundPair[]
    ) => {
        // Background for the visualization area (dark gray)
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);

        // Draw funds on the left side
        const fundBoxHeight = 50; // Reduced height for each fund box
        const fundBoxWidth = 180;
        const fundSpacing = 30; // Reduced spacing between funds
        const totalFundsHeight = funds.length * fundBoxHeight + (funds.length - 1) * fundSpacing;
        let fundStartY = (height - totalFundsHeight) / 2;

        const fundPositions: { [key: string]: { x: number, y: number, width: number, height: number } } = {};

        funds.forEach((fund, index) => {
            const y = fundStartY + index * (fundBoxHeight + fundSpacing);

            // Store position for later use
            fundPositions[fund.id] = {
                x: 50, // Moved further left
                y,
                width: fundBoxWidth,
                height: fundBoxHeight
            };

            // Draw fund box
            ctx.fillStyle = '#2a2a2a';
            ctx.beginPath();
            ctx.roundRect(50, y, fundBoxWidth, fundBoxHeight, 8);
            ctx.fill();

            // Draw colored indicator bar - now on the right side of the fund box
            ctx.fillStyle = fund.color;
            ctx.fillRect(fundBoxWidth + 55, y, 5, fundBoxHeight);

            // Draw fund name
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';

            // Improved text wrapping to ensure text stays within the fund box
            const maxWidth = fundBoxWidth - 20; // Leave some padding
            const words = fund.name.split(' ');
            let lines = [];
            let currentLine = words[0];

            // Create lines that fit within the box width
            for (let i = 1; i < words.length; i++) {
                const testLine = currentLine + ' ' + words[i];
                const metrics = ctx.measureText(testLine);

                if (metrics.width > maxWidth) {
                    lines.push(currentLine);
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine); // Add the last line

            // Calculate vertical position for text
            const lineHeight = 16;
            const totalTextHeight = lines.length * lineHeight;
            let textY = y + (fundBoxHeight - totalTextHeight) / 2 + lineHeight;

            // Draw each line centered in the box
            lines.forEach(line => {
                ctx.fillText(line, fundBoxWidth / 2 + 50, textY);
                textY += lineHeight;
            });
        });

        // Draw stocks on the right side
        const stockBoxHeight = 30;
        const stockSpacing = 20;
        const totalStocksHeight = commonStocks.length * stockBoxHeight + (commonStocks.length - 1) * stockSpacing;
        let stockStartY = (height - totalStocksHeight) / 2;

        const stockPositions: { [key: string]: { x: number, y: number } } = {};

        commonStocks.forEach((stock, index) => {
            const y = stockStartY + index * (stockBoxHeight + stockSpacing);

            // Store position for later use
            stockPositions[stock] = {
                x: width - 120, // Moved further right
                y: y + stockBoxHeight / 2
            };

            // Draw stock label
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '14px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(stock, width - 20, y + stockBoxHeight / 2 + 4);

            // Draw small square indicator for each stock
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(width - 130, y + stockBoxHeight / 2 - 2, 4, 4);
        });

        // Draw connections between funds and stocks
        ctx.lineWidth = 1.5;

        // Create a map to track which stocks are common between which funds
        const fundStockMap: Record<string, Set<string>> = {};

        // Initialize the map for each fund
        funds.forEach(fund => {
            fundStockMap[fund.id] = new Set<string>();
        });

        // Populate the map based on overlap pairs
        overlapPairs.forEach(pair => {
            if (pair.data && pair.data.commonStocks) {
                const fund1Id = pair.fund1.toString();
                const fund2Id = pair.fund2.toString();

                pair.data.commonStocks.forEach(stock => {
                    if (fundStockMap[fund1Id]) fundStockMap[fund1Id].add(stock);
                    if (fundStockMap[fund2Id]) fundStockMap[fund2Id].add(stock);
                });
            }
        });

        // For each fund, connect to its common stocks
        funds.forEach((fund) => {
            const fundPos = fundPositions[fund.id];
            const fundCenterY = fundPos.y + fundPos.height / 2;
            const fundEndX = fundPos.x + fundPos.width + 5; // Start from the right edge of the fund box

            // Get the stocks for this fund
            const stocksForFund = fundStockMap[fund.id] || new Set<string>();

            // Draw connections only to stocks that are common for this fund
            commonStocks.forEach((stock) => {
                if (stocksForFund.has(stock)) {
                    const stockPos = stockPositions[stock];

                    // Create gradient for the curve
                    const gradient = ctx.createLinearGradient(fundEndX, fundCenterY, stockPos.x, stockPos.y);
                    gradient.addColorStop(0, fund.color + '80'); // 50% opacity at start
                    gradient.addColorStop(1, fund.color + '40'); // 25% opacity at end

                    ctx.strokeStyle = gradient;

                    // Draw the curve
                    ctx.beginPath();
                    ctx.moveTo(fundEndX, fundCenterY);

                    // Control points for the bezier curve
                    const cp1x = fundEndX + (stockPos.x - fundEndX) * 0.4;
                    const cp1y = fundCenterY;
                    const cp2x = fundEndX + (stockPos.x - fundEndX) * 0.6;
                    const cp2y = stockPos.y;

                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, stockPos.x, stockPos.y);
                    ctx.stroke();
                }
            });
        });
    };

    return (
        <div ref={containerRef} className="relative h-[500px] w-full">
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
            />
        </div>
    );
} 