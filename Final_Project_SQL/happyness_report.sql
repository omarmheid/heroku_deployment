CREATE TABLE happyness_report (
	overall_rank INT PRIMARY KEY NOT NULL, 
	country VARCHAR(50) NOT NULL, 
	score FLOAT NOT NULL, 
	gdp_per_captia FLOAT NOT NULL, 
	socail_support FLOAT NOT NULL, 
	healthy_life_expectancy FLOAT NOT NULL, 
	freedom_of_choices FLOAT NOT NULL, 
	generosity FLOAT NOT NULL, 
	perception_of_corruption FLOAT NOT NULL
);
