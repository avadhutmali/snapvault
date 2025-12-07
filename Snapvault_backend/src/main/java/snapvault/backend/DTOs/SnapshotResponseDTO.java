package snapvault.backend.DTOs;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SnapshotResponseDTO {

    private Long id;
    private String snapShotName;
    private LocalDateTime localDateTime;
    private String directoryPath;
    private String projectName;
}
