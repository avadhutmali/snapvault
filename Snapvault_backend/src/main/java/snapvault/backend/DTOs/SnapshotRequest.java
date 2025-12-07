package snapvault.backend.DTOs;

import lombok.Data;

@Data
public class SnapshotRequest {
    private String directoryPath;
    private String snapShotName;
    private String projectName;
}
