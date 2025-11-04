package snapvault.backend.Core;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Diff {
    
    public static SnapshotDiff findChanges(Map<String,String> oldHash , Map<String,String> newHash){
        List<String> changes = new ArrayList<>();

        SnapshotDiff snapshotDiff = new SnapshotDiff();

        for(String key : newHash.keySet()){
            if(!oldHash.containsKey(key))snapshotDiff.getAdded().add(key);
            else{
                if(oldHash.get(key)==null)snapshotDiff.modified.add(key);
                else if(!oldHash.get(key).equals(newHash.get(key)))snapshotDiff.modified.add(key);
            }
        }
        for(String key : oldHash.keySet()){
            if(!newHash.containsKey(key))snapshotDiff.getDeleted().add(key);
        }
        return snapshotDiff;

    }
}
