# CoFly-GUI-demo

<p align="center">
<img src="https://user-images.githubusercontent.com/77329407/105342573-3040e900-5be9-11eb-92df-7c09392b1e0c.png" width="300" />

# Description
  
```CoFly-GUI``` is a novel, low-cost, user-friendly Precision Agriculture platform that attempts to alleviate the drawbacks of limited battery life by carefully designing missions tailored to each field's specific, time-changing characteristics. The proposed platform aims at providing the operator/farmer with a cost-effective and end-to-end integrated system that is able to accomplish autonomous tasks that were used to completed manually (e.g. crop growth monitoring). Besides, it will play a supportive role in decision-making objectives (e.g. possible weed infestations) enhancing crop yield management decisions by assisting non-expert users in proper manipulations. In specific, the proposed system is capable of:
  
* UAV built-in flight planning for automated crop monitoring _([Waypoint-Trajectory-Planning](https://github.com/CoFly-Project/Waypoint-Trajectory-Planning) module)_
* Integrated image processing functionalities for orthomosaic extraction and vegetation health estimation _([Vegetation-Indices](https://github.com/CoFly-Project/Vegetation-Indices) module)_
* Automatically extracts possible problematic areas of the field _([Problematic-Areas-Detection](https://github.com/CoFly-Project/Problematic-Areas-Detection) module)_ and subsequently designs a follow-up UAV mission to acquire extra information on these regions
* UAV built-in site-specific mission based on the extracted knowledge and combined with incorporated deep learning model _([Weed-Detection](https://github.com/CoFly-Project/Weed-Detection) module)_ trained on the _[CoFly-WeedDB](https://github.com/CoFly-Project/CoFly-WeedDB)_ dataset for weed detection
* Timeline view for storing information according to the year's harvest

All the above functionalities are enclosed into an open-source, end-to-end platform, named Cognitional Operations of micro Flying vehicles (CoFly). The effectiveness of the proposed system was tested and validated with extensive experimentation in agricultural fields with cotton in Larissa, Greece during two different crop sessions. In Figure 1, we present the architecture of CoFly.

&nbsp;
    
  <p align="center">
<img src="https://user-images.githubusercontent.com/80779522/150432702-1fdcdfb5-0525-491f-9708-4feec9532bfe.png" width="700" />
<figcaption align = "center"><p align="center">
  Figure 1. CoFly’s high-level architecture.</figcaption>
</figure>
  
# Installation
  
1. Clone this repo
2. Download & install [Node.js](https://nodejs.org/en/download/)
3. Open terminal on ~REPO_PATH
4. Install all necessary dependecies
```
npm install
```
5. Run CoFly-GUI
```
npm start
```

# Usage

The developed platform offers capabilities that fit each field's characteristics, such as no-fly zones inside the area of interest and automatic UAV-based weed detection. In this section, we present the operations and data postprocessing capabilities of this application.

### Main Menu
&nbsp;

<p align="center">
  <img src="https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/main_screen.gif?raw=true?raw=true" width="700" /> 
</p>

When CoFly-GUI is installed, the above screen is the main menu. The main menu has 3 options:
* _Load project_ (see an existing project)
* _Create project_ (create a new project)
* _Import project_ (import a project from a hardware system to another).

## Create Project
&nbsp;
<p align="center">
  <img src="https://user-images.githubusercontent.com/80779522/150781535-409959f6-f978-42ab-9772-3aa464aa919c.gif" width="700" /> 
</p>

&nbsp;

The blue polygon refers to the field of interest for further examination. The bounds of field of interest are set manually by the user.

## UAV Mission
&nbsp;

<p align="center">
  <img src="https://user-images.githubusercontent.com/80779522/150785574-46b1d791-4d48-4e1a-8d16-1fe46a24eed3.gif" width="450" />
<!--   <img src="https://user-images.githubusercontent.com/80779522/150701039-7eb7bce0-eca9-4099-b34e-45b554a487cd.gif" width="450" /> -->
<!--   <img src="https://user-images.githubusercontent.com/80779522/150529437-bf236c11-fcb7-4250-a50b-71a0038acfd1.gif" width="450" /> -->
  <img src="https://user-images.githubusercontent.com/80779522/151338834-042cc58f-92e2-4742-8e08-cadd02a30100.gif" width="450" /> 
</p>

After setting the scanning area, we export the UAV mission path with the _[Waypoint-Trajectory-Planning](https://github.com/CoFly-Project/Waypoint-Trajectory-Planning)_ module. We demonstrate the extracted UAV path planning with and without obstacles (red color). The obstacles are set manually by the user. Also, the end-user has the ability of knowing the position of UAV ![drone](https://user-images.githubusercontent.com/80779522/150684252-8c488c70-c6a7-4811-998f-73e47525c987.png).

## Orthomosaic

<p align="center">
  <img src="https://user-images.githubusercontent.com/80779522/150786840-90adcde2-79ce-4a9d-901a-8ceb8283bcb9.gif" width="700" />
<!--   <img src="https://user-images.githubusercontent.com/80779522/150759302-c9a09187-98c0-4f69-9eeb-6fb0469526b5.gif" width="700" /> -->
</p>

&nbsp;

When the UAV mission completes, the built-in stitching process starts automatically using the visual footage as captured by UAV during its mission. The result of image stitching process is the orthomosaic of the under study field. Also, some update messages appear in order to inform the end-user about the progress of the pipeline.

## Vegetation Indices

<p align="center">
  <img src="https://user-images.githubusercontent.com/80779522/150790539-207264a6-37ba-466a-8eab-d2b77dde8a18.gif" width="700" />
</p>

&nbsp;

The result of image stitching process is further processed in order to calculate the vegetation indices (VIs) with the _[Vegetation-Indices](https://github.com/CoFly-Project/Vegetation-Indices)_ module. Each VIs represents the actual reflectance of the examined field’s vegetation in different color bands and thus, it can reflect different measures of crop health.

## Problematic Areas

<p align="center">
   <img src="https://user-images.githubusercontent.com/80779522/150811130-404bc6d6-2612-452e-ac67-ae1cfe0f7ad1.gif" width="450" />
   <img src="https://user-images.githubusercontent.com/80779522/150809786-06d13db5-798a-45ab-b4ad-b82df3880f37.gif" width="450" />
</p>

&nbsp;

Based on VIs maps, we identify the problematic areas of the under study field in terms of vegetation health using _[Problematic-Areas-Detection](https://github.com/CoFly-Project/Problematic-Areas-Detection)_ module. For every detected area, the center of mass is calculated leading to a set of points, considered as points of interest. The end-user has the option to see the UAV nearest captured image and remove them. Each point of interest is annotated with ![marker](https://user-images.githubusercontent.com/80779522/150548185-cdca1129-fd36-4749-bbe8-181f822921de.png).


## Hot-Point Mission

<p align="center">
<!--   <img src="https://user-images.githubusercontent.com/80779522/151336877-31e632f1-be27-419f-b32c-8c1c013ccce2.gif" width="700" /> -->
  <img src="https://user-images.githubusercontent.com/80779522/151541174-ff16cf78-1362-4014-8573-f0d7ed40560d.gif" width="700" />
</p>

&nbsp;

Hot-Poin Mission focuses on the detected points of interest for each VI. Again, the UAV path planning is extracted by the  _[Waypoint-Trajectory-Planning](https://github.com/CoFly-Project/Waypoint-Trajectory-Planning)_ module. During this mission, visual footage from lower altitudes and different camera angles is captured aiming to visually detect crop health deterioration sources, such as weed plants, in order to enable site-specific treatment.

## Weed-Detection

 <p align="center">
  <img src="https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/Weed_Detection.gif?raw=true" width="700" />
</p>

&nbsp;

The developed operation of ```CoFly-GUI``` is capable of semantically segmenting weed instances depicted on input RGB images as captured during the Site-Specific Mission and thus, provides accurate information regarding the location of detected weeds _([Weed-Detection](https://github.com/CoFly-Project/Weed-Detection)_ module). In this way, the end-user has the ability to schedule counteractions on the spot. 

## Crop Calendar Logging


 <p align="center">
  <img src="https://github.com/CoFly-Project/cofly-gui/blob/master/readme_images/Calendar_.gif?raw=true" width="700" />
</p>

&nbsp;

A cropping calendar is a schedule of the crop growing season from the fallow period and land preparation, to crop establishment and maintenance, to harvest and storage. Using this allows better planning of all farm activities and the cost of production. 

## Missions Gallery

<p align="center">
  <img src="https://user-images.githubusercontent.com/80779522/150977353-9e0ae4e2-2715-408e-92dc-baa894c8c50e.gif" width="700" />
</p>

&nbsp;

All the captured UAV images during the coverage mission are availabe in _PHOTO GALLERY_ option. These images are seperated per date and time of UAV mission.

## In conclusion
```CoFly-GUI``` is an intuitive graphical user interface including higher level user commands and proper data representations depicting the results of the UAV’s operation. The final product is capable to accomplish tasks previously completed manually (e.g. crop growth monitoring) and play a supportive role in decision making objectives (e.g. possible insect infestations). 

# Citation
(not published yet)

# Acknowledgment
This research has been financed by the European Regional Development Fund of the European Union and Greek national funds through the Operational Program Competitiveness, Entrepreneurship and Innovation, under the call RESEARCH - CREATE - INNOVATE (T1EDK-00636).
