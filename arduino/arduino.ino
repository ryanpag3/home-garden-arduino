#define MOISTURE_SENSOR_A0 A0
#define MOISTURE_SENSOR_A1 A1

#define WATER_PUMP_SENSOR_6 6
#define WATER_PUMP_SENSOR_5 5

// unused
#define WATER_PUMP_SENSOR_4 4
#define WATER_PUMP_SENSOR_3 3

const int WATER_SENSORS[] = {
  WATER_PUMP_SENSOR_3, 
  WATER_PUMP_SENSOR_4,
  WATER_PUMP_SENSOR_5,
  WATER_PUMP_SENSOR_6
};

const float MINIMUM_WETNESS = 550;

void setup() {
  Serial.begin(9600); // open serial port
  setupMoistureSensors();
  setupWaterPumps();
}

void setupMoistureSensors() {
  // these are not the droids you are looking for
}

void setupWaterPumps() {
  for (int i = 0; i < sizeof(WATER_SENSORS); i++) {
    pinMode(WATER_SENSORS[i], OUTPUT);
    digitalWrite(WATER_SENSORS[i], HIGH);
  }
}

void loop () {
  Cron.create("* * * * *", doAllWateringTasks, true);
  Cron.delay();
}

void doAllWateringTasks() {
    doWateringTask(MOISTURE_SENSOR_A0, WATER_PUMP_SENSOR_4);
    doWateringTask(MOISTURE_SENSOR_A1, WATER_PUMP_SENSOR_3);
}

void doWateringTask(int moistureSensor, int pumpSensor) {
    float reading = getMoistureReading(moistureSensor);
    
    if (!isDry(reading))
      return;

    waterPlant(pumpSensor);
}

float getMoistureReading(int sensor) {
    Serial.print("getting moisture reading for: ");
    Serial.println(sensor);
    const int amtReadings = 100;
    float sum = 0;
    for (int i = 0; i < amtReadings; i++) {
      sum += analogRead(sensor);
      delay(5);
    }
    sum = sum / amtReadings;
    Serial.println("sum");
    Serial.println(sum);
    return sum;
}

boolean isDry(float reading) {
   return reading >= MINIMUM_WETNESS;
}

void waterPlant(int pumpSensor) {
    turnOnWaterPump(pumpSensor);
    delay(5000);
    turnOffWaterPump(pumpSensor);
}

void turnOnWaterPump(int pumpSensor) {
  digitalWrite(pumpSensor, LOW);
}

void turnOffWaterPump(int pumpSensor) {
  digitalWrite(pumpSensor, HIGH);
}
