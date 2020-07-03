CREATE TABLE happiness (
	Country VARCHAR(50) PRIMARY KEY, 
	Travel_PopDensity_sqmile FLOAT, 
	Travel_Coastline_Ratio FLOAT, 
	Travel_InCountry_Growth FLOAT, 
	Travel_Number_Of_Arrivals FLOAT, 
	Soc_GDP_PerCapita FLOAT, 
	Soc_Literacy_Pop FLOAT,
	Soc_Suicide_Per_100K FLOAT,
	Soc_Birthrate_Cbr FLOAT,
	Eco_Agriculture FLOAT,
	Eco_Industry FLOAT,
	Eco_Service FLOAT,
	Eco_Self_Employed FLOAT,
	Pop_Female FLOAT,
	Pop_AvgHousehold_Size FLOAT, 
	Pop_HouseholdType_Nuclear FLOAT, 
	Pop_HouseholdType_NumberChildren FLOAT,
	Travel_Rank FLOAT,
	Society_Rank FLOAT,
	Economy_Rank FLOAT,
	Pop_Rank FLOAT,
	Overall_Rank FLOAT
);

SELECT * FROM happiness
