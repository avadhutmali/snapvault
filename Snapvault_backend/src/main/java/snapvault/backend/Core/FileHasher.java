package snapvault.backend.Core;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class FileHasher {
    
    public static String generateFileHash(String filePath) throws IOException,NoSuchAlgorithmException{
        try{
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte contents[] = Files.readAllBytes(Paths.get(filePath));

            byte[] hash = digest.digest(contents);
            StringBuilder hexHash = new StringBuilder();

            for(byte b : hash){
                String hex = Integer.toHexString(0xff & b);
                if(hex.length()==1)hexHash.append(0);
                hexHash.append(hex);
            }
            return hexHash.toString();
        }
        catch(NoSuchAlgorithmException e){
            throw new RuntimeException ("SHA-256 not avaliabble ",e);
        }

    }
}
