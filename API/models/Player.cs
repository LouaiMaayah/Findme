public record LatLng(double Lat, double Lng);

public class Player
{
    public required string username { get; set; }
    public string? connectionId { get; set; }
    public string? lobby { get; set; }
    public LatLng? hidingPlace { get; set; }

}