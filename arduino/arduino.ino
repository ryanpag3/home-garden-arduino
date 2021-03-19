#define TASK_INTERVAL_MS 3000
#define WATERING_LENGTH_MS 5000

#define MOISTURE_SENSOR_A0 A0
#define MOISTURE_SENSOR_A1 A1

#define WATER_PUMP_SENSOR_6 6
#define WATER_PUMP_SENSOR_5 5
#define WATER_PUMP_SENSOR_4 4
#define WATER_PUMP_SENSOR_3 3

const byte DATA_MAX_SIZE = 32;
char cmd[DATA_MAX_SIZE];
int cmdIndex;
char incomingByte;

const int WATER_SENSORS[] = {
  WATER_PUMP_SENSOR_3, 
  WATER_PUMP_SENSOR_4,
  WATER_PUMP_SENSOR_5,
  WATER_PUMP_SENSOR_6
};

// const float MINIMUM_WETNESS = 550;

// triggers watering no matter what
const float MINIMUM_WETNESS = 0;

/**
 * SETUP
 */
void setup() {
  Serial.begin(9600); // open serial port
  setupMoistureSensors();
  setupWaterPumps();
  cmdIndex = 0;
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

/**
 * MAIN
 */
void loop () {
  if (incomingByte = Serial.available() > 0) {
    char byteIn = Serial.read();
    cmd[cmdIndex] = byteIn;
    if (byteIn == '\n') {
      // Serial.println("end of message found");
      // done
      cmd[cmdIndex] = '\0';
      cmdIndex = 0;

      String strCmd = String(cmd);
      if (strcmp(cmd, "RUNTASKS") == 0) {
         doAllWateringTasks();
      } else if (strcmp(cmd, "WATERPLANT") == 0) {
          waterPlant(WATER_PUMP_SENSOR_4);
          waterPlant(WATER_PUMP_SENSOR_3);
      } 
    } else {
        if (cmdIndex++ >= DATA_MAX_SIZE) {
          cmdIndex = 0;
        }
    }
  }
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
    const int amtReadings = 100;
    float sum = 0;
    for (int i = 0; i < amtReadings; i++) {
      sum += analogRead(sensor);
      delay(5);
    }
    sum = sum / amtReadings;

    // for api-adapter
    Serial.print("moisture_reading;");
    Serial.print("sensor:");
    Serial.print(sensor);
    Serial.print(";");
    Serial.print("reading:");
    Serial.print(sum);
    Serial.println(";");
    
    return sum;
}

boolean isDry(float reading) {
   return reading >= MINIMUM_WETNESS;
}

void waterPlant(int pumpSensor) {
    turnOnWaterPump(pumpSensor);
    delay(WATERING_LENGTH_MS);
    turnOffWaterPump(pumpSensor);
    // for api-adapter
    Serial.print("watering;");
    Serial.print("sensor:");
    Serial.print(pumpSensor);
    Serial.print(";");
    Serial.print("length:");
    Serial.print(WATERING_LENGTH_MS);
    Serial.println(";");
}

void turnOnWaterPump(int pumpSensor) {
  digitalWrite(pumpSensor, LOW);
}

void turnOffWaterPump(int pumpSensor) {
  digitalWrite(pumpSensor, HIGH);
}
