$(document).ready(function(){

  draw_grid(10);

  document.querySelector('.btn').addEventListener('click', function() {
    // alert("click");
    var gridSize = Number($("#txt_grid_size").val());
    if(gridSize > 10)
    {
      gridSize = 10;
      $("#txt_grid_size").val("10");
      alert("Maximum grid size is 10");
    }

    var start = $("#txt_start").val().split(",").map(Number);
    var end = $("#txt_end").val().split(",").map(Number);
    var obstacles_str = $("#txt_obstacles").val();
    var obstacles = [];

    if(obstacles_str != "")
    {
      try
      {
        obstacles = JSON.parse(obstacles_str);
      }
      catch(error)
      {
        alert("Obstacles values malformed, ex: [[1,0],[1,1],[2,1]]");
      }
    }
    
    draw_grid(gridSize);
    find_path(gridSize,start,end,obstacles);

  });

  function draw_grid(gridSize)
  {
    $(".container").html("");

    var grid_template_columns = "";
    var grid_items = "";

    for (var i=0; i<gridSize; i++) 
    {
      grid_template_columns += " auto";
      for (var j=0; j<gridSize; j++) {
        //Render HTML Grid
        grid_items += `<div id="item_${i}_${j}" class="item" data-pos="${i},${j}">[${i},${j}]</div>`;
      }
    }

    $(".container").css("grid-template-columns",grid_template_columns);
    $(".container").append(grid_items);

    // $(".item").on("click",function(){
    //   alert($(this).attr("data-pos"));
    // });
  }

  function find_path(gridSize,start,end,obstacles)
  {
    $(".container").html("");

    var grid_template_columns = "";
    var grid_items = "";

    // Create a 5x5 grid
    // Represent the grid as a 2-dimensional array
    // var gridSize = 5;
    var grid = [];
    var grid_binary = [];
    for (var i=0; i<gridSize; i++) 
    {
      grid_template_columns += " auto";

      grid[i] = [];
      grid_binary[i] = [];
      for (var j=0; j<gridSize; j++) {
        grid[i][j] = 'Empty';
        grid_binary[i][j] = 0;

        //Render HTML Grid
        grid_items += `<div id="item_${i}_${j}" class="item" data-pos="${i},${j}">[${i},${j}]</div>`;
      }
    }

    $(".container").css("grid-template-columns",grid_template_columns);
    $(".container").append(grid_items);

    $(".item").on("click",function(){
      alert($(this).attr("data-pos"));
    });

    // Think of the first index as "distance from the top row"
    // Think of the second index as "distance from the left-most column"
    var start_row = start[0];
    var start_column = start[1];

    var end_row = end[0];
    var end_column = end[1];

    // This is how we would represent the grid with obstacles above
    grid[start_row][start_column] = "Start";
    grid[end_row][end_column] = "Goal";

    // Start / End
    $(`#item_${start_row}_${start_column}`).addClass("item_start");
    $(`#item_${end_row}_${end_column}`).addClass("item_end");

    for(var i=0; i<obstacles.length; i++)
    {
      grid[obstacles[i][0]][obstacles[i][1]] = "Obstacle";
      $(`#item_${obstacles[i][0]}_${obstacles[i][1]}`).addClass("item_obstacle");
    }

    for (var i=0; i<gridSize; i++) {
      for (var j=0; j<gridSize; j++) {
        //Start
        if(grid[i][j] === 'Start')
          grid_binary[i][j] = 1;
        //Goal
        if(grid[i][j] === 'Goal')
          grid_binary[i][j] = 2;
        //Obstacle
        if(grid[i][j] === 'Obstacle')
          grid_binary[i][j] = -1;
        //Empty
        if(grid[i][j] === 'Empty')
          grid_binary[i][j] = 0;
      }
    }

    var shortest_path = findShortestPath([start_row,start_column], grid);
    if(shortest_path)
    {
      var pos_rows = start_row;
      var pos_columns = start_column;

      for(var i=0; i<shortest_path.length-1; i++)
      {
        if(shortest_path[i] === 'North')
          pos_rows--;
        
        if(shortest_path[i] === 'East')
          pos_columns++;

        if(shortest_path[i] === 'South')
          pos_rows++;
        
        if(shortest_path[i] === 'West')
          pos_columns--;
        
        grid_binary[pos_rows][pos_columns] = 1;
        $(`#item_${pos_rows}_${pos_columns}`).addClass("item_path");
      }
    }
    else
      alert("Path not found!");

    console.log(grid_binary);
  }

});