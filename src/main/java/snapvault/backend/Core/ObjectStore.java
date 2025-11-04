package snapvault.backend.Core;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ObjectStore {
    private static final String SOURCE_PATH = "snapvault_data";

    public String storeFile(String sourceFilePath, String hash) throws IOException{
        Files.createDirectories(Paths.get(SOURCE_PATH));
        
        String destinationPath = SOURCE_PATH+"/"+hash;

        if(!Files.exists(Paths.get(destinationPath))){
            Files.copy(Paths.get(sourceFilePath), Paths.get(destinationPath));
        }

        return destinationPath;

    }
}
