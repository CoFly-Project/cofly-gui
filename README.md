# CoFly GUI

Project Description
----------------------
This paper presents a novel, low-cost, user-friendly Precision Agriculture platform that attempts to alleviate the drawbacks of limited battery life by carefully designing missions tailored to each field's specific, time-changing characteristics. The proposed system is capable of designing coverage missions for any type of UAVs, integrating field characteristics inside the resulting trajectory, such as irregular field shape and obstacles. The collected images are automatically processed to create detailed orthomosaics of the field and extract the corresponding vegetation indices. A novel mechanism is then introduced that automatically extracts possible problematic areas of the field and subsequently designs a follow-up UAV mission to acquire extra information on these regions. The toolchain is completed by employing a specifically designed deep learning module to detect weeds in the close-examination flight. For the development of such a deep-learning module, a new weeds dataset from the UAV's perspective, which is publicly available for download, was collected and annotated. All
the above functionalities are enclosed into an open-source, end-to-end platform, named Cognitional Operations of micro Flying vehicles (CoFly). The effectiveness of the proposed system was tested and validated with extensive experimentation in
agricultural fields with cotton in Larissa, Greece during two different crop sessions.

## Installation

First of all download & install [Node.js](https://nodejs.org/en/download/). After installation of node js clone the repo visit with terminal and excecute commands.

Install all necessary dependecies
```bash
npm install
```
To run the GUI
```bash
npm start
```

## Usage

Load / Create / Import 


![alt text](https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/main_screen.gif?raw=true?raw=true)

Set your scanning 


![alt text](https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/field_selection.jpg?raw=true)

Set Obstacles & Calculate Drone 


![alt text](https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/obstacles_gid.gif?raw=true)
![alt text](https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/calculated_map.jpg?raw=true)


Excecute the mission


![alt text](https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/mission_start.gif?raw=true)

Finish Mission & 


![alt text](https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/finish_scan_imerologio_agrou.gif?raw=true)


Stiched Image

![alt text](https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/stiching_photo.gif?raw=true)

![alt text](https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/stiched_image.jpg?raw=true)

Photo Indices


![alt text](https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/photo_indeces.gif?raw=true)

Problematic Areas


![alt text](https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/alerts.gif?raw=true)



## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
