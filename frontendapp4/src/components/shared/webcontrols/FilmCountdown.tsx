import React, { useState,Component } from "react";
import "./FilmCountdown.css";

type FilmCountdownProps = {
    target: string;
    circleSize?: number;
    textSize?: number;
    initialCount?: number;
    fadeOutTime?: number;
    onFinish?: () => void;
};

type FilmCountdownState = {
    currentCount: number;
    isVisible: boolean;
};

export default class FilmCountdown extends Component<FilmCountdownProps, FilmCountdownState> {

    static defaultProps = {
        target: "body",
        circleSize: 70,
        textSize: 15,
        initialCount: 10,
        fadeOutTime: 1000,
    };

    private countdownInterval: NodeJS.Timeout | null = null;
    
    constructor(props: FilmCountdownProps) {
        super(props);

        this.state = {
            currentCount: props.initialCount || 10,
            isVisible: true,
        };
    }
    start(callback: () => void) {
        
        // Your logic for starting the countdown
        this.startCountdown(callback);
      }
    componentDidMount() {

    }

    componentWillUnmount() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    startCountdown = (callback: () => void) => {
        this.countdownInterval = setInterval(() => {
            this.setState(
                (prevState) => ({ currentCount: prevState.currentCount - 1 }),
                () => {
                    if (this.state.currentCount < 0) {
                        this.stopCountdown(callback);
                    }
                }
            );
        }, 1000);
    };

    stopCountdown = (callback: () => void) => {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        setTimeout(() => {
            this.setState({ isVisible: false }, () => {
                if (this.props.onFinish) {
                    this.props.onFinish();
                }
            });
            callback();
        }, this.props.fadeOutTime);
    };

    render() {
        const { circleSize, textSize } = this.props;
        const { currentCount, isVisible } = this.state;

        if (!isVisible) return null;

        return (
            <div
                className="countdown-container flex items-center justify-center w-full h-full bg-gray-400 relative overflow-hidden"
                style={{
                    ["--circle-size" as any]: `${circleSize}vmin`,
                    ["--text-size" as any]: `${textSize}vmin`,
                }}
            >
                <div className="countdown-wrapper relative w-screen h-screen">
                    <div className="rotating-wedge absolute top-1/2 left-1/2 w-[var(--circle-size)] h-[var(--circle-size)] transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-10 animate-spin"></div>
                    <div className="film-circle absolute top-1/2 left-1/2 w-[var(--circle-size)] h-[var(--circle-size)] transform -translate-x-1/2 -translate-y-1/2 rounded-full border-[calc(var(--circle-size)*0.02)] border-white box-border">
                        <div className="absolute top-1/2 left-1/2 w-[calc(var(--circle-size)*0.83)] h-[calc(var(--circle-size)*0.83)] transform -translate-x-1/2 -translate-y-1/2 rounded-full border-[calc(var(--circle-size)*0.01)] border-white opacity-80"></div>
                    </div>
                    <div className="line-horizontal absolute top-1/2 left-1/2 w-[var(--circle-size)] h-[calc(var(--circle-size)*0.005)] transform -translate-x-1/2 -translate-y-1/2 bg-black opacity-60"></div>
                    <div className="line-vertical absolute top-1/2 left-1/2 w-[calc(var(--circle-size)*0.005)] h-[var(--circle-size)] transform -translate-x-1/2 -translate-y-1/2 bg-black opacity-60"></div>
                    <div className="countdown-number absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-[var(--text-size)] text-black opacity-85">
                        {currentCount >= 0 ? currentCount : ""}
                    </div>
                </div>
            </div>
        );
    }
}
