module energy_saver(
    input clk,
    input reset,
    input students_present,
    input daylight,
    input manual_override,
    output reg light,
    output reg fan,
    output reg energy_saving
);

always @(posedge clk) begin
    if (reset) begin
        light <= 0;
        fan <= 0;
        energy_saving <= 1;
    end
    else begin
        if (students_present) begin
            fan <= 1;

            if (daylight)
                light <= 0;
            else
                light <= 1;
        end
        else begin
            light <= 0;
            fan <= 0;
        end

        if (!students_present || daylight)
            energy_saving <= 1;
        else
            energy_saving <= 0;

        if (manual_override) begin
            light <= 1;
            fan <= 1;
            energy_saving <= 0;
        end
    end
end

endmodule
