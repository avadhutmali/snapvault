package snapvault.backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileMetadataResponseDTO {
    
    private String originalFilePath;
    private String contentHash;
    private long fileSize;
}
