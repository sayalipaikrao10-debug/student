`timescale 1ns/1ps

module energy_saver_tb;

reg clk;
reg reset;
reg students_present;
reg daylight;
reg manual_override;

wire light;
wire fan;
wire energy_saving;

energy_saver uut(
    .clk(clk),
    .reset(reset),
    .students_present(students_present),
    .daylight(daylight),
    .manual_override(manual_override),
    .light(light),
    .fan(fan),
    .energy_saving(energy_saving)
);

always #5 clk = ~clk;

initial begin
    clk = 0;
    reset = 1;
    students_present = 0;
    daylight = 0;
    manual_override = 0;

    $dumpfile("energy_saver.vcd");
    $dumpvars(0, energy_saver_tb);

    $monitor(
        "Time=%0t Students=%b Daylight=%b Light=%b Fan=%b EnergySaving=%b",
        $time, students_present, daylight,
        light, fan, energy_saving
    );

    #10 reset = 0;

    // Classroom empty
    #10 students_present = 0;

    // Students enter, low daylight
    #10 students_present = 1;
        daylight = 0;

    // Sufficient daylight
    #10 daylight = 1;

    // Classroom becomes empty
    #10 students_present = 0;

    // Manual override
    #10 manual_override = 1;

    #10 manual_override = 0;

    #10 $display("Simulation Completed Successfully");

    $finish;
end

endmodule
