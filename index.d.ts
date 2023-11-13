// index.d.ts
declare module 'praycalc' {
    export function getMoon(date: Date, latitude?: number, longitude?: number, elevation?: number, temp?: number, pressure?: number, humidity?: number, clouds?: number): MoonDetails;  
    export function getTimes(date: Date, lat: number, lng: number, tz: number, elevation?: number, temperature?: number, pressure?: number): TimesReturnType;
    export function calcTimes(date: Date, lat: number, lng: number, tz: number, elevation?: number, temperature?: number, pressure?: number): CalcTimesReturnType;
    export function getTimesAll(date: Date, lat: number, lng: number, tz: number, elevation?: number, temperature?: number, pressure?: number): TimesAllReturnType;
    export function calcTimesAll(date: Date, lat: number, lng: number, tz: number, elevation?: number, temperature?: number, pressure?: number): CalcTimesAllReturnType;

    interface MoonPosition {
      azimuth: number;
      altitude: number;
      distance: number;
      parallacticAngle: number;
    }

    interface MoonIllumination {
      fraction: number;
      phase: number;
      angle: number;
    }

    interface MoonDetails {
      phase: number;
      phaseName: string;
      phaseSymbol: string;
      position: MoonPosition;
      illumination: MoonIllumination;
      visibility: number;
    }

    interface TimesReturnType {
        Qiyam: number;
        Fajr: number;
        Sunrise: number;
        Noon: number;
        Dhuhr: number;
        Asr: number;
        Maghrib: number;
        Isha: number;
        Angles: number[];
      }
    
      interface CalcTimesReturnType {
        Qiyam: string;
        Fajr: string;
        Sunrise: string;
        Noon: string;
        Dhuhr: string;
        Asr: string;
        Maghrib: string;
        Isha: string;
        Angles: number[];
      }
    
      interface TimesAllReturnType {
        Qiyam: number;
        Fajr: number;
        Sunrise: number;
        Noon: number;
        Dhuhr: number;
        Asr: number;
        Maghrib: number;
        Isha: number;
        Methods: Record<string, string[]>;
        Angles: number[];
      }
    
      interface CalcTimesAllReturnType {
        Qiyam: string;
        Fajr: string;
        Sunrise: string;
        Noon: string;
        Dhuhr: string;
        Asr: string;
        Maghrib: string;
        Isha: string;
        Methods: Record<string, string[]>;
        Angles: number[];
      }
    }
